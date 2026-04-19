const { createHash, createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } = require('crypto');
const { config } = require('./config');

const LOGIN_WINDOW_MS = Math.max(60_000, Number(config.adminLoginWindowMs) || 15 * 60_000);
const MAX_ATTEMPTS = Math.max(3, Number(config.adminLoginMaxAttempts) || 8);
const BLOCK_MS = Math.max(60_000, Number(config.adminLoginBlockMs) || 15 * 60_000);
const SESSION_TTL_MS = Math.max(5 * 60_000, Number(config.adminSessionTtlMs) || 12 * 60 * 60_000);

const attemptsByIp = new Map();

function sha256Buffer(value) {
  return createHash('sha256').update(String(value || ''), 'utf8').digest();
}

function safeTextEqual(a, b) {
  return timingSafeEqual(sha256Buffer(a), sha256Buffer(b));
}

function base64UrlEncode(text) {
  return Buffer.from(String(text || ''), 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function base64UrlDecode(value) {
  const normalized = String(value || '')
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const padLength = (4 - (normalized.length % 4)) % 4;
  return Buffer.from(normalized + '='.repeat(padLength), 'base64').toString('utf8');
}

function signWithSecret(payload, secret) {
  const encoded = base64UrlEncode(JSON.stringify(payload || {}));
  const signature = createHmac('sha256', secret).update(encoded).digest('hex');
  return `${encoded}.${signature}`;
}

function verifyWithSecret(token, secret) {
  const text = String(token || '').trim();
  if (!text || !text.includes('.')) return null;
  const [encoded, signature] = text.split('.');
  if (!encoded || !signature) return null;
  const expected = createHmac('sha256', secret).update(encoded).digest('hex');
  if (!safeTextEqual(signature, expected)) return null;
  try {
    return JSON.parse(base64UrlDecode(encoded));
  } catch (error) {
    return null;
  }
}

function normalizeUsername(value) {
  return String(value || '')
    .trim()
    .toLowerCase();
}

function normalizePassword(value) {
  return String(value || '');
}

function parsePasswordHash(hashValue) {
  const text = String(hashValue || '').trim();
  if (!text) return null;
  const parts = text.split('$');
  if (parts.length !== 4) return null;
  const [algo, iterationsText, salt, digest] = parts;
  const iterations = Number(iterationsText);
  if (algo !== 'pbkdf2_sha256' || !Number.isFinite(iterations) || iterations < 10_000) return null;
  if (!salt || !digest) return null;
  return { iterations, salt, digest };
}

function hashPassword(password, salt, iterations) {
  return pbkdf2Sync(String(password || ''), String(salt || ''), iterations, 32, 'sha256').toString('hex');
}

function verifyConfiguredPassword(password) {
  const parsed = parsePasswordHash(config.adminPasswordHash);
  if (parsed) {
    const computed = hashPassword(password, parsed.salt, parsed.iterations);
    return safeTextEqual(computed, parsed.digest);
  }
  const fallbackPassword = String(config.adminPassword || '');
  if (!fallbackPassword) return false;
  return safeTextEqual(password, fallbackPassword);
}

function issueSessionToken(username, ipAddress) {
  const now = Date.now();
  const payload = {
    kind: 'officino-admin-session',
    username,
    issuedAt: new Date(now).toISOString(),
    expiresAt: new Date(now + SESSION_TTL_MS).toISOString(),
    nonce: randomBytes(12).toString('hex'),
    ipHash: createHash('sha256').update(String(ipAddress || ''), 'utf8').digest('hex').slice(0, 16)
  };
  return signWithSecret(payload, config.adminSessionSecret);
}

function getIpBucket(ipAddress) {
  const key = String(ipAddress || 'unknown').trim() || 'unknown';
  const now = Date.now();
  const existing = attemptsByIp.get(key);
  if (!existing) {
    const bucket = { attempts: 0, firstAt: now, blockedUntil: 0 };
    attemptsByIp.set(key, bucket);
    return bucket;
  }
  if (now - existing.firstAt > LOGIN_WINDOW_MS) {
    existing.attempts = 0;
    existing.firstAt = now;
    existing.blockedUntil = 0;
  }
  return existing;
}

function validateLoginInput(username, password) {
  const normalizedUsername = normalizeUsername(username);
  const normalizedPassword = normalizePassword(password);
  if (!normalizedUsername || normalizedUsername.length > 64) {
    return { ok: false, message: 'Username is required.' };
  }
  if (!/^[a-zA-Z0-9._@-]+$/.test(normalizedUsername)) {
    return { ok: false, message: 'Username format is not valid.' };
  }
  if (!normalizedPassword || normalizedPassword.length < 8 || normalizedPassword.length > 256) {
    return { ok: false, message: 'Password is required.' };
  }
  return { ok: true, username: normalizedUsername, password: normalizedPassword };
}

function authenticateAdmin({ username, password, ipAddress }) {
  const validation = validateLoginInput(username, password);
  if (!validation.ok) {
    return { ok: false, status: 400, message: validation.message };
  }
  const bucket = getIpBucket(ipAddress);
  const now = Date.now();
  if (bucket.blockedUntil > now) {
    const retryAfterSec = Math.ceil((bucket.blockedUntil - now) / 1000);
    return {
      ok: false,
      status: 429,
      retryAfterSec,
      message: `Too many failed attempts. Try again in ${retryAfterSec}s.`
    };
  }

  const expectedUser = normalizeUsername(config.adminUsername || 'admin');
  const userOk = safeTextEqual(validation.username, expectedUser);
  const passOk = verifyConfiguredPassword(validation.password);
  if (!userOk || !passOk) {
    bucket.attempts += 1;
    if (bucket.attempts >= MAX_ATTEMPTS) {
      bucket.blockedUntil = now + BLOCK_MS;
      bucket.firstAt = now;
    }
    return { ok: false, status: 401, message: 'Invalid username or password.' };
  }

  bucket.attempts = 0;
  bucket.firstAt = now;
  bucket.blockedUntil = 0;
  return {
    ok: true,
    username: validation.username,
    token: issueSessionToken(validation.username, ipAddress),
    expiresInSec: Math.floor(SESSION_TTL_MS / 1000)
  };
}

function verifyAdminToken(token) {
  const payload = verifyWithSecret(token, config.adminSessionSecret);
  if (!payload || payload.kind !== 'officino-admin-session') return null;
  const expiresAtMs = new Date(payload.expiresAt).getTime();
  if (!Number.isFinite(expiresAtMs) || Date.now() > expiresAtMs) return null;
  const username = normalizeUsername(payload.username || '');
  if (!username) return null;
  return {
    username,
    issuedAt: payload.issuedAt,
    expiresAt: payload.expiresAt
  };
}

module.exports = {
  authenticateAdmin,
  verifyAdminToken,
  hashPassword
};
