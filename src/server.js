const path = require('path');
const express = require('express');
const cors = require('cors');
const { config } = require('./config');
const { authenticateAdmin, verifyAdminToken } = require('./admin-auth');
const {
  createLicense,
  listLicenses,
  getLicenseById,
  deactivateLicenseById,
  activateLicenseById,
  activateLicense,
  validateTokenAndTouch,
  deactivateLicense
} = require('./license-service');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.resolve(process.cwd(), 'public')));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
  );
  next();
});

function parseIpAddress(req) {
  const value = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || '');
  if (!value.includes(',')) return value.trim();
  return value.split(',')[0].trim();
}

function extractAdminToken(req) {
  const authHeader = String(req.headers.authorization || '').trim();
  if (authHeader.toLowerCase().startsWith('bearer ')) {
    return authHeader.slice(7).trim();
  }
  return String(req.headers['x-admin-token'] || '').trim();
}

function sanitizeText(value, maxLen) {
  const cleaned = String(value || '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned.slice(0, maxLen);
}

function normalizeLicensePayload(input) {
  const customerName = sanitizeText(input?.customerName, 120);
  const notes = sanitizeText(input?.notes, 500);
  const maxDevices = Math.max(1, Math.min(50, Number(input?.maxDevices) || 1));
  if (!customerName) {
    throw new Error('Customer name is required.');
  }
  return { customerName, notes, maxDevices };
}

function requireAdmin(req, res, next) {
  const token = extractAdminToken(req);
  const session = verifyAdminToken(token);
  if (!session) {
    return res.status(401).json({ ok: false, message: 'Unauthorized admin session.' });
  }
  req.adminSession = session;
  return next();
}

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'officino-server', now: new Date().toISOString() });
});

app.get('/api/meta', (req, res) => {
  res.json({
    ok: true,
    baseUrl: config.publicBaseUrl,
    downloads: {
      windows: config.downloadWindowsUrl,
      mac: config.downloadMacUrl
    }
  });
});

app.get('/admin', (req, res) => {
  res.sendFile(path.resolve(process.cwd(), 'public', 'admin.html'));
});

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body || {};
  const ipAddress = parseIpAddress(req);
  const result = authenticateAdmin({ username, password, ipAddress });
  if (!result.ok) {
    if (result.retryAfterSec) {
      res.setHeader('Retry-After', String(result.retryAfterSec));
    }
    return res.status(result.status || 401).json({ ok: false, message: result.message || 'Login failed.' });
  }
  return res.json({
    ok: true,
    token: result.token,
    username: result.username,
    expiresInSec: result.expiresInSec
  });
});

app.get('/api/admin/session', requireAdmin, (req, res) => {
  res.json({
    ok: true,
    session: {
      username: req.adminSession.username,
      issuedAt: req.adminSession.issuedAt,
      expiresAt: req.adminSession.expiresAt
    }
  });
});

app.post('/api/activation/activate', (req, res) => {
  try {
    const { activationKey, machineId, deviceName } = req.body || {};
    const ipAddress = parseIpAddress(req);
    const result = activateLicense({ activationKey, machineId, deviceName, ipAddress });
    return res.json({ ok: true, ...result });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message || 'Activation failed.' });
  }
});

app.post('/api/activation/validate', (req, res) => {
  try {
    const { token, machineId } = req.body || {};
    const ipAddress = parseIpAddress(req);
    const result = validateTokenAndTouch({ token, machineId, ipAddress });
    return res.json({ ok: true, ...result });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message || 'Validation failed.' });
  }
});

app.post('/api/activation/deactivate', (req, res) => {
  try {
    const { activationKey, machineId } = req.body || {};
    const result = deactivateLicense({ activationKey, machineId });
    return res.json({ ok: true, ...result });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message || 'Deactivation failed.' });
  }
});

app.get('/api/admin/licenses', requireAdmin, (req, res) => {
  res.json({ ok: true, licenses: listLicenses() });
});

app.post('/api/admin/licenses', requireAdmin, (req, res) => {
  try {
    const payload = normalizeLicensePayload(req.body || {});
    const result = createLicense(payload);
    res.json({
      ok: true,
      license: {
        id: result.license.id,
        keyLast4: result.license.keyLast4,
        customerName: result.license.customerName,
        maxDevices: result.license.maxDevices,
        status: result.license.status,
        createdAt: result.license.createdAt
      },
      activationKey: result.activationKey
    });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message || 'Could not create license.' });
  }
});

app.get('/api/admin/licenses/:id', requireAdmin, (req, res) => {
  try {
    const license = getLicenseById(String(req.params.id || '').trim());
    res.json({ ok: true, license });
  } catch (error) {
    res.status(404).json({ ok: false, message: error.message || 'License not found.' });
  }
});

app.post('/api/admin/licenses/:id/deactivate', requireAdmin, (req, res) => {
  try {
    const result = deactivateLicenseById(String(req.params.id || '').trim());
    res.json({ ok: true, ...result });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message || 'Could not deactivate license.' });
  }
});

app.post('/api/admin/licenses/:id/activate', requireAdmin, (req, res) => {
  try {
    const result = activateLicenseById(String(req.params.id || '').trim());
    res.json({ ok: true, ...result });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message || 'Could not activate license.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(process.cwd(), 'public', 'index.html'));
});

app.listen(config.port, config.host, () => {
  console.log(`[officino-server] listening on http://${config.host}:${config.port}`);
  console.log(`[officino-server] public base url: ${config.publicBaseUrl}`);
  if (!String(config.adminPasswordHash || '').trim() && !String(config.adminPassword || '').trim()) {
    console.warn('[officino-server] WARNING: ADMIN_PASSWORD or ADMIN_PASSWORD_HASH is not configured.');
  }
});
