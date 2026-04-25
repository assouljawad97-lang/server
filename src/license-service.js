const { randomUUID } = require('crypto');
const {
  readDb,
  writeDb,
  hashActivationKey,
  generateActivationKey
} = require('./storage');
const { signToken, verifyToken } = require('./token-service');

function nowIso() {
  return new Date().toISOString();
}

function isExpired(expiresAt) {
  if (!expiresAt) return false;
  const ms = new Date(expiresAt).getTime();
  return Number.isFinite(ms) && Date.now() > ms;
}

function normalizeHardwareFingerprint(value) {
  return String(value || '').trim();
}

async function createLicense({ customerName, maxDevices = 1, notes = '' }) {
  const db = await readDb();

  const activationKey = generateActivationKey();
  const keyHash = hashActivationKey(activationKey);

  const license = {
    id: randomUUID(),
    activationKey,
    keyHash,
    keyLast4: activationKey.slice(-4),
    customerName: String(customerName || '').trim(),
    maxDevices: Math.max(1, Number(maxDevices) || 1),
    status: 'ACTIVE',
    notes: String(notes || ''),
    createdAt: nowIso(),
    activations: []
  };

  db.licenses.push(license);
  await writeDb(db);

  return { license, activationKey };
}

async function listLicenses() {
  const db = await readDb();
  return db.licenses.map((item) => ({
    id: item.id,
    customerName: item.customerName,
    keyLast4: item.keyLast4,
    status: item.status,
    maxDevices: item.maxDevices,
    createdAt: item.createdAt,
    activationsCount: Array.isArray(item.activations) ? item.activations.length : 0
  }));
}

async function listActivationOverview() {
  const db = await readDb();
  return db.licenses.map((license) => {
    const activations = Array.isArray(license.activations) ? license.activations : [];
    return {
      id: license.id,
      customerName: license.customerName || '',
      activationKey: license.activationKey || '',
      keyLast4: license.keyLast4 || '',
      status: license.status || 'UNKNOWN',
      maxDevices: Number(license.maxDevices) || 1,
      devicesBound: activations.length,
      activations: activations.map((a) => ({
        hardwareFingerprint: a.hardwareFingerprint || '',
        deviceName: a.deviceName || '',
        activatedAt: a.activatedAt || '',
        lastSeenAt: a.lastSeenAt || '',
        firstSeenIp: a.firstSeenIp || '',
        lastSeenIp: a.lastSeenIp || ''
      }))
    };
  });
}

async function listDeviceHistory() {
  const db = await readDb();
  const rows = [];
  (db.licenses || []).forEach((license) => {
    const activations = Array.isArray(license.activations) ? license.activations : [];
    activations.forEach((a) => {
      rows.push({
        licenseId: license.id,
        customerName: license.customerName || '',
        keyLast4: license.keyLast4 || '',
        licenseStatus: license.status || 'UNKNOWN',
        hardwareFingerprint: a.hardwareFingerprint || '',
        deviceName: a.deviceName || '',
        activatedAt: a.activatedAt || '',
        lastSeenAt: a.lastSeenAt || '',
        firstSeenIp: a.firstSeenIp || '',
        lastSeenIp: a.lastSeenIp || ''
      });
    });
  });
  rows.sort((a, b) => String(b.lastSeenAt || b.activatedAt || '').localeCompare(String(a.lastSeenAt || a.activatedAt || '')));
  return rows;
}

async function getLicenseById(id) {
  const db = await readDb();
  const license = db.licenses.find((item) => item.id === id);
  if (!license) throw new Error('License not found.');

  return {
    id: license.id,
    customerName: license.customerName,
    activationKey: license.activationKey || null,
    keyLast4: license.keyLast4,
    status: license.status,
    maxDevices: license.maxDevices,
    notes: license.notes || '',
    createdAt: license.createdAt,
    activations: Array.isArray(license.activations) ? license.activations : []
  };
}

async function deactivateLicenseById(id) {
  const db = await readDb();
  const license = db.licenses.find((item) => item.id === id);
  if (!license) throw new Error('License not found.');

  license.status = 'DEACTIVATED';
  license.deactivatedAt = nowIso();

  await writeDb(db);

  return {
    id: license.id,
    status: license.status,
    deactivatedAt: license.deactivatedAt
  };
}

async function activateLicenseById(id) {
  const db = await readDb();
  const license = db.licenses.find((item) => item.id === id);
  if (!license) throw new Error('License not found.');

  license.status = 'ACTIVE';
  delete license.deactivatedAt;
  license.activatedBackAt = nowIso();

  await writeDb(db);
  return {
    id: license.id,
    status: license.status,
    activatedBackAt: license.activatedBackAt
  };
}

function findLicenseByKey(db, activationKey) {
  const keyHash = hashActivationKey(activationKey);
  return db.licenses.find((item) => item.keyHash === keyHash);
}

async function activateLicense({ activationKey, hardwareFingerprint, deviceName, ipAddress }) {
  const safeFingerprint = normalizeHardwareFingerprint(hardwareFingerprint);
  if (!safeFingerprint) throw new Error('hardwareFingerprint is required.');

  const db = await readDb();
  const license = findLicenseByKey(db, activationKey);

  if (!license) throw new Error('Activation key is invalid.');
  if (license.status !== 'ACTIVE') throw new Error('License is not active.');

  const activations = Array.isArray(license.activations) ? license.activations : [];
  const existing = activations.find(
    (a) => String(a.hardwareFingerprint || '') === safeFingerprint
  );

  if (!existing && activations.length >= Math.max(1, Number(license.maxDevices) || 1)) {
    throw new Error('Maximum devices reached.');
  }

  if (existing) {
    existing.lastSeenAt = nowIso();
    existing.lastSeenIp = String(ipAddress || '');
    existing.deviceName = String(deviceName || existing.deviceName || '');
    existing.hardwareFingerprint = String(existing.hardwareFingerprint || safeFingerprint);
  } else {
    activations.push({
      hardwareFingerprint: safeFingerprint,
      deviceName: String(deviceName || ''),
      activatedAt: nowIso(),
      lastSeenAt: nowIso(),
      firstSeenIp: String(ipAddress || ''),
      lastSeenIp: String(ipAddress || '')
    });
  }

  license.activations = activations;
  await writeDb(db);

  const token = signToken({
    kind: 'officino-license',
    licenseId: license.id,
    hardwareFingerprint: safeFingerprint,
    keyLast4: license.keyLast4,
    issuedAt: nowIso(),
    expiresAt: null
  });

  return { token, keyLast4: license.keyLast4 };
}

async function validateTokenAndTouch({ token, hardwareFingerprint, ipAddress }) {
  const payload = verifyToken(token);
  if (!payload) throw new Error('Invalid token.');

  const db = await readDb();
  const license = db.licenses.find((l) => l.id === payload.licenseId);

  if (!license) throw new Error('License not found.');
  if (String(license.status || '').toUpperCase() !== 'ACTIVE') {
    throw new Error('License is not active.');
  }

  const providedFingerprint = normalizeHardwareFingerprint(hardwareFingerprint);
  const tokenFingerprint = normalizeHardwareFingerprint(payload.hardwareFingerprint);
  const expectedFingerprint = tokenFingerprint || providedFingerprint;
  if (!expectedFingerprint) {
    throw new Error('Device fingerprint is missing.');
  }
  if (tokenFingerprint && providedFingerprint && tokenFingerprint !== providedFingerprint) {
    throw new Error('Token does not match this device.');
  }

  const activations = Array.isArray(license.activations) ? license.activations : [];
  const existing = activations.find(
    (a) => String(a.hardwareFingerprint || '') === expectedFingerprint
  );
  if (!existing) {
    throw new Error('Device is not bound to this key.');
  }
  existing.lastSeenAt = nowIso();
  existing.lastSeenIp = String(ipAddress || '');
  existing.hardwareFingerprint = String(existing.hardwareFingerprint || expectedFingerprint);
  license.activations = activations;
  await writeDb(db);

  return { valid: true, keyLast4: license.keyLast4 };
}

async function deactivateLicense({ activationKey, hardwareFingerprint }) {
  const db = await readDb();
  const license = findLicenseByKey(db, activationKey);

  if (!license) throw new Error('Invalid key.');
  const safeFingerprint = normalizeHardwareFingerprint(hardwareFingerprint);
  if (!safeFingerprint) throw new Error('hardwareFingerprint is required.');

  license.activations = (license.activations || []).filter(
    (a) => String(a.hardwareFingerprint || '') !== safeFingerprint
  );

  await writeDb(db);

  return { removed: true };
}

async function unbindActivationById({ licenseId, hardwareFingerprint }) {
  const db = await readDb();
  const license = db.licenses.find((item) => item.id === licenseId);
  if (!license) throw new Error('License not found.');
  const safeFingerprint = normalizeHardwareFingerprint(hardwareFingerprint);
  if (!safeFingerprint) throw new Error('hardwareFingerprint is required.');

  const beforeCount = Array.isArray(license.activations) ? license.activations.length : 0;
  license.activations = (license.activations || []).filter(
    (a) => String(a.hardwareFingerprint || '') !== safeFingerprint
  );
  const removed = beforeCount - license.activations.length;
  if (removed <= 0) {
    throw new Error('Activation not found for this device.');
  }

  await writeDb(db);
  return { removed: true, removedCount: removed };
}

module.exports = {
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
};
