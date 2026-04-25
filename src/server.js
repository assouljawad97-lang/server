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
const {
  createOrder,
  listOrders,
  respondToOrder
} = require('./order-service');
const { isMailConfigured, sendOrderEmail } = require('./mailer');
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

function normalizeEmail(value) {
  const email = sanitizeText(value, 160).toLowerCase();
  if (!email) return '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return '';
  return email;
}

function normalizePhone(value) {
  const raw = sanitizeText(value, 40).replace(/[^\d+()\-\s]/g, '');
  const compact = raw.replace(/\s+/g, '');
  if (compact.length < 6) return '';
  return raw;
}

function normalizeName(value, maxLen = 80) {
  return sanitizeText(value, maxLen).replace(/[^a-zA-ZÀ-ÿ\u0600-\u06FF' -]/g, '').trim();
}

const orderThrottle = new Map();

function canSubmitOrder(ipAddress) {
  const key = String(ipAddress || 'unknown');
  const now = Date.now();
  const existing = orderThrottle.get(key) || [];
  const kept = existing.filter((ts) => now - ts < 10 * 60 * 1000);
  if (kept.length >= 10) {
    orderThrottle.set(key, kept);
    return false;
  }
  kept.push(now);
  orderThrottle.set(key, kept);
  return true;
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

app.post('/api/orders', async (req, res) => {
  try {
    const ipAddress = parseIpAddress(req);
    if (!canSubmitOrder(ipAddress)) {
      return res.status(429).json({ ok: false, message: 'Too many requests. Please try again later.' });
    }

    const firstName = normalizeName(req.body?.firstName, 80);
    const lastName = normalizeName(req.body?.lastName, 80);
    const email = normalizeEmail(req.body?.email);
    const phone = normalizePhone(req.body?.phone);
    const honeypot = String(req.body?.website || '').trim();
    if (honeypot) {
      return res.status(400).json({ ok: false, message: 'Invalid request.' });
    }
    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({ ok: false, message: 'First name, last name, email, and phone are required.' });
    }

    const order = await createOrder({ firstName, lastName, email, phone });
    logServerEvent('INFO', 'order received', { orderId: order.id, email: order.email });
    return res.json({ ok: true, orderId: order.id });
  } catch (error) {
    logServerEvent('ERROR', 'create order failed', error);
    return res.status(400).json({ ok: false, message: error.message || 'Order failed.' });
  }
});

app.get('/admin', (req, res) => {
  res.sendFile(path.resolve(process.cwd(), 'public', 'admin.html'));
});

app.get('/order', (req, res) => {
  res.sendFile(path.resolve(process.cwd(), 'public', 'order.html'));
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

app.get('/api/admin/orders', requireAdmin, async (req, res) => {
  try {
    const orders = await listOrders();
    res.json({ ok: true, orders });
  } catch (error) {
    logServerEvent('ERROR', 'admin orders list failed', error);
    res.status(500).json({ ok: false, message: 'Failed to load orders.' });
  }
});

app.post('/api/admin/orders/:id/respond', requireAdmin, async (req, res) => {
  try {
    const orderId = String(req.params.id || '').trim();
    const subject = sanitizeText(req.body?.subject, 200);
    const message = sanitizeText(req.body?.message, 4000);
    const activationKey = sanitizeText(req.body?.activationKey, 120);
    if (!subject || !message) {
      return res.status(400).json({ ok: false, message: 'Subject and message are required.' });
    }
    if (!isMailConfigured()) {
      return res.status(400).json({
        ok: false,
        message: 'Email service is not configured. Please set SMTP env values.'
      });
    }

    const orders = await listOrders();
    const order = orders.find((item) => String(item.id) === orderId);
    if (!order || !order.email) {
      return res.status(404).json({ ok: false, message: 'Order email was not found.' });
    }

    let emailMeta = null;
    let emailStatus = 'FAILED';
    let emailError = '';
    try {
      emailMeta = await sendOrderEmail({
        to: order.email,
        subject,
        message,
        activationKey
      });
      emailStatus = 'SENT';
    } catch (sendError) {
      emailStatus = 'FAILED';
      emailError = String(sendError?.message || 'Send failed.');
    }

    const result = await respondToOrder({
      orderId,
      adminUser: req.adminSession.username,
      subject,
      message,
      activationKey,
      emailStatus,
      emailError,
      emailMeta
    });
    logServerEvent('INFO', 'order responded', { orderId, by: req.adminSession.username });
    if (emailStatus !== 'SENT') {
      return res.json({
        ok: true,
        ...result,
        emailStatus,
        emailError: emailError || 'SMTP error.'
      });
    }
    res.json({ ok: true, ...result, emailStatus });
  } catch (error) {
    logServerEvent('ERROR', 'order response failed', error);
    res.status(400).json({ ok: false, message: error.message || 'Failed to respond to order.' });
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
