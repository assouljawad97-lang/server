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

function normalizeMachineId(machineId) {
  return String(machineId || '').trim();
}

function createLicense({ customerName, maxDevices = 1, notes = '' }) {
  const db = readDb();
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
  writeDb(db);
  return {
    license,
    activationKey
  };
}

function listLicenses() {
  const db = readDb();
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

function getLicenseById(id) {
  const db = readDb();
  const license = db.licenses.find((item) => item.id === id);
  if (!license) {
    throw new Error('License not found.');
  }
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

function deactivateLicenseById(id) {
  const db = readDb();
  const license = db.licenses.find((item) => item.id === id);
  if (!license) {
    throw new Error('License not found.');
  }
  license.status = 'DEACTIVATED';
  license.deactivatedAt = nowIso();
  writeDb(db);
  return {
    id: license.id,
    status: license.status,
    deactivatedAt: license.deactivatedAt
  };
}

function findLicenseByKey(db, activationKey) {
  const keyHash = hashActivationKey(activationKey);
  return db.licenses.find((item) => item.keyHash === keyHash);
}

function activateLicense({ activationKey, machineId, deviceName, ipAddress }) {
  const safeMachineId = normalizeMachineId(machineId);
  if (!safeMachineId) {
    throw new Error('machineId is required.');
  }
  const db = readDb();
  const license = findLicenseByKey(db, activationKey);
  if (!license) throw new Error('Activation key is invalid.');
  if (license.status !== 'ACTIVE') throw new Error('License is not active.');

  const activations = Array.isArray(license.activations) ? license.activations : [];
  const existing = activations.find((a) => a.machineId === safeMachineId);
  if (!existing && activations.length >= Math.max(1, Number(license.maxDevices) || 1)) {
    throw new Error('Maximum devices reached for this license.');
  }
  if (existing) {
    existing.lastSeenAt = nowIso();
    existing.deviceName = String(deviceName || existing.deviceName || '');
    existing.lastSeenIp = String(ipAddress || existing.lastSeenIp || '');
  } else {
    activations.push({
      machineId: safeMachineId,
      deviceName: String(deviceName || ''),
      firstSeenIp: String(ipAddress || ''),
      lastSeenIp: String(ipAddress || ''),
      activatedAt: nowIso(),
      lastSeenAt: nowIso()
    });
  }
  license.activations = activations;
  writeDb(db);

  const token = signToken({
    kind: 'officino-license',
    licenseId: license.id,
    machineId: safeMachineId,
    keyLast4: license.keyLast4,
    issuedAt: nowIso(),
    expiresAt: null
  });

  return {
    token,
    keyLast4: license.keyLast4,
    expiresAt: null
  };
}

function validateTokenAndTouch({ token, machineId, ipAddress }) {
  const payload = verifyToken(token);
  if (!payload || payload.kind !== 'officino-license') {
    throw new Error('Invalid token.');
  }
  if (payload.expiresAt && isExpired(payload.expiresAt)) {
    throw new Error('License expired.');
  }
  const safeMachineId = normalizeMachineId(machineId || payload.machineId);
  if (!safeMachineId) throw new Error('machineId is required.');
  if (payload.machineId !== safeMachineId) {
    throw new Error('Token machine mismatch.');
  }

  const db = readDb();
  const license = db.licenses.find((item) => item.id === payload.licenseId);
  if (!license || license.status !== 'ACTIVE') {
    throw new Error('License inactive.');
  }
  const activation = (license.activations || []).find((a) => a.machineId === safeMachineId);
  if (!activation) {
    throw new Error('Device is not activated for this license.');
  }
  activation.lastSeenAt = nowIso();
  activation.lastSeenIp = String(ipAddress || activation.lastSeenIp || '');
  writeDb(db);
  return {
    valid: true,
    keyLast4: license.keyLast4,
    expiresAt: null
  };
}

function activateLicenseById(id) {
  const db = readDb();
  const license = db.licenses.find((item) => item.id === id);
  if (!license) {
    throw new Error('License not found.');
  }
  license.status = 'ACTIVE';
  license.activatedBackAt = nowIso();
  writeDb(db);
  return {
    id: license.id,
    status: license.status
  };
}

function deactivateLicense({ activationKey, machineId }) {
  const safeMachineId = normalizeMachineId(machineId);
  if (!safeMachineId) throw new Error('machineId is required.');
  const db = readDb();
  const license = findLicenseByKey(db, activationKey);
  if (!license) throw new Error('Activation key is invalid.');
  const before = Array.isArray(license.activations) ? license.activations.length : 0;
  license.activations = (license.activations || []).filter((a) => a.machineId !== safeMachineId);
  const removed = before !== license.activations.length;
  writeDb(db);
  return { removed };
}

module.exports = {
  createLicense,
  listLicenses,
  getLicenseById,
  deactivateLicenseById,
  activateLicenseById,
  activateLicense,
  validateTokenAndTouch,
  deactivateLicense
};
