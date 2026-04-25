const path = require('path');
const express = require('express');
const cors = require('cors');
const { config } = require('./config');
const { authenticateAdmin, verifyAdminToken } = require('./admin-auth');
const {
  createLicense,
  listLicenses,
  listActivationOverview,
  listDeviceHistory,
  getLicenseById,
  deactivateLicenseById,
  activateLicenseById,
  activateLicense,
  validateTokenAndTouch,
  deactivateLicense,
  unbindActivationById
} = require('./license-service');
const { logServerEvent, readServerLogs, getLogInfo } = require('./server-logger');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.resolve(process.cwd(), 'public')));

process.on('uncaughtException', (error) => {
  logServerEvent('ERROR', 'uncaughtException', error);
});

process.on('unhandledRejection', (reason) => {
  logServerEvent('ERROR', 'unhandledRejection', reason);
});

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
    return res.status(result.status || 401).json({ ok: false, message: result.message });
  }

  return res.json({
    ok: true,
    token: result.token,
    username: result.username,
    expiresInSec: result.expiresInSec
  });
});

app.get('/api/admin/session', requireAdmin, async (req, res) => {
  res.json({
    ok: true,
    session: {
      username: req.adminSession.username,
      issuedAt: req.adminSession.issuedAt,
      expiresAt: req.adminSession.expiresAt
    }
  });
});

// ✅ FIXED
app.post('/api/activation/activate', async (req, res) => {
  try {
    const { activationKey, hardwareFingerprint, deviceName } = req.body || {};
    const ipAddress = parseIpAddress(req);
    const result = await activateLicense({ activationKey, hardwareFingerprint, deviceName, ipAddress });
    return res.json({ ok: true, ...result });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message });
  }
});

// ✅ FIXED
app.post('/api/activation/validate', async (req, res) => {
  try {
    const { token, hardwareFingerprint } = req.body || {};
    const ipAddress = parseIpAddress(req);
    const result = await validateTokenAndTouch({ token, hardwareFingerprint, ipAddress });
    return res.json({ ok: true, ...result });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message });
  }
});

// ✅ FIXED
app.post('/api/activation/deactivate', async (req, res) => {
  try {
    const { activationKey, hardwareFingerprint } = req.body || {};
    const result = await deactivateLicense({ activationKey, hardwareFingerprint });
    return res.json({ ok: true, ...result });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error.message });
  }
});

app.get('/api/admin/licenses', requireAdmin, async (req, res) => {
  try {
    const licenses = await listLicenses();
    res.json({ ok: true, licenses });
  } catch (error) {
    logServerEvent('ERROR', 'admin licenses list failed', error);
    res.status(500).json({ ok: false, message: 'Failed to load licenses.' });
  }
});

app.post('/api/admin/licenses', requireAdmin, async (req, res) => {
  try {
    const payload = normalizeLicensePayload(req.body || {});
    const result = await createLicense(payload);

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
    logServerEvent('ERROR', 'admin create license failed', error);
    res.status(400).json({ ok: false, message: error.message });
  }
});

// ✅ FIXED
app.get('/api/admin/licenses/:id', requireAdmin, async (req, res) => {
  try {
    const license = await getLicenseById(String(req.params.id || '').trim());
    res.json({ ok: true, license });
  } catch (error) {
    logServerEvent('ERROR', 'admin get license details failed', error);
    res.status(404).json({ ok: false, message: error.message });
  }
});

// ✅ FIXED
app.post('/api/admin/licenses/:id/deactivate', requireAdmin, async (req, res) => {
  try {
    const result = await deactivateLicenseById(String(req.params.id || '').trim());
    res.json({ ok: true, ...result });
  } catch (error) {
    logServerEvent('ERROR', 'admin deactivate license failed', error);
    res.status(400).json({ ok: false, message: error.message });
  }
});

// ✅ FIXED
app.post('/api/admin/licenses/:id/activate', requireAdmin, async (req, res) => {
  try {
    const result = await activateLicenseById(String(req.params.id || '').trim());
    res.json({ ok: true, ...result });
  } catch (error) {
    logServerEvent('ERROR', 'admin activate license failed', error);
    res.status(400).json({ ok: false, message: error.message });
  }
});

app.post('/api/admin/licenses/:id/unbind', requireAdmin, async (req, res) => {
  try {
    const licenseId = String(req.params.id || '').trim();
    const { hardwareFingerprint } = req.body || {};
    const result = await unbindActivationById({ licenseId, hardwareFingerprint });
    res.json({ ok: true, ...result });
  } catch (error) {
    logServerEvent('ERROR', 'admin unbind device failed', error);
    res.status(400).json({ ok: false, message: error.message });
  }
});

app.get('/api/admin/activations', requireAdmin, async (req, res) => {
  try {
    const rows = await listActivationOverview();
    res.json({ ok: true, activations: rows });
  } catch (error) {
    logServerEvent('ERROR', 'admin activations list failed', error);
    res.status(500).json({ ok: false, message: 'Failed to load activations.' });
  }
});

app.get('/api/admin/devices', requireAdmin, async (req, res) => {
  try {
    const rows = await listDeviceHistory();
    res.json({ ok: true, devices: rows });
  } catch (error) {
    logServerEvent('ERROR', 'admin devices list failed', error);
    res.status(500).json({ ok: false, message: 'Failed to load devices.' });
  }
});

app.get('/api/admin/logs', requireAdmin, async (req, res) => {
  try {
    const level = String(req.query.level || '').trim();
    const limit = Number(req.query.limit || 300);
    const logs = readServerLogs({ level, limit });
    const info = getLogInfo();
    res.json({ ok: true, logs, logFilePath: info.logFilePath });
  } catch (error) {
    logServerEvent('ERROR', 'admin logs list failed', error);
    res.status(500).json({ ok: false, message: 'Failed to load logs.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(process.cwd(), 'public', 'index.html'));
});

app.listen(config.port, config.host, () => {
  logServerEvent('INFO', `server started on http://${config.host}:${config.port}`);
  console.log(`[officino-server] listening on http://${config.host}:${config.port}`);
  console.log(`[officino-server] public base url: ${config.publicBaseUrl}`);
});
