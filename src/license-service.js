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

function findLicenseByKey(db, activationKey) {
  const keyHash = hashActivationKey(activationKey);
  return db.licenses.find((item) => item.keyHash === keyHash);
}

async function activateLicense({ activationKey, machineId, deviceName, ipAddress }) {
  const safeMachineId = normalizeMachineId(machineId);
  if (!safeMachineId) throw new Error('machineId is required.');

  const db = await readDb();
  const license = findLicenseByKey(db, activationKey);

  if (!license) throw new Error('Activation key is invalid.');
  if (license.status !== 'ACTIVE') throw new Error('License is not active.');

  const activations = Array.isArray(license.activations) ? license.activations : [];
  const existing = activations.find((a) => a.machineId === safeMachineId);

  if (!existing && activations.length >= Math.max(1, Number(license.maxDevices) || 1)) {
    throw new Error('Maximum devices reached.');
  }

  if (existing) {
    existing.lastSeenAt = nowIso();
  } else {
    activations.push({
      machineId: safeMachineId,
      deviceName: String(deviceName || ''),
      activatedAt: nowIso(),
      lastSeenAt: nowIso()
    });
  }

  license.activations = activations;
  await writeDb(db);

  const token = signToken({
    kind: 'officino-license',
    licenseId: license.id,
    machineId: safeMachineId,
    keyLast4: license.keyLast4,
    issuedAt: nowIso(),
    expiresAt: null
  });

  return { token, keyLast4: license.keyLast4 };
}

async function validateTokenAndTouch({ token, machineId }) {
  const payload = verifyToken(token);
  if (!payload) throw new Error('Invalid token.');

  const db = await readDb();
  const license = db.licenses.find((l) => l.id === payload.licenseId);

  if (!license) throw new Error('License not found.');

  return { valid: true, keyLast4: license.keyLast4 };
}

async function deactivateLicense({ activationKey, machineId }) {
  const db = await readDb();
  const license = findLicenseByKey(db, activationKey);

  if (!license) throw new Error('Invalid key.');

  license.activations = (license.activations || []).filter(
    (a) => a.machineId !== machineId
  );

  await writeDb(db);

  return { removed: true };
}

module.exports = {
  createLicense,
  listLicenses,
  getLicenseById,
  deactivateLicenseById,
  activateLicense,
  validateTokenAndTouch,
  deactivateLicense
};