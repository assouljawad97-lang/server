const { randomUUID } = require('crypto');
const {
  License,
  initDB,
  hashActivationKey,
  generateActivationKey
} = require('./storage');
const { signToken, verifyToken } = require('./token-service');

function nowIso() {
  return new Date().toISOString();
}

function normalizeMachineId(machineId) {
  return String(machineId || '').trim();
}

async function createLicense({ customerName, maxDevices = 1, notes = '' }) {
  await initDB();

  const activationKey = generateActivationKey();
  const keyHash = hashActivationKey(activationKey);

  const license = await License.create({
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
  });

  return { license, activationKey };
}

async function listLicenses() {
  await initDB();

  const licenses = await License.find().lean();

  return licenses.map((item) => ({
    id: item.id,
    customerName: item.customerName,
    keyLast4: item.keyLast4,
    status: item.status,
    maxDevices: item.maxDevices,
    createdAt: item.createdAt,
    activationsCount: item.activations?.length || 0
  }));
}

async function getLicenseById(id) {
  await initDB();

  const license = await License.findOne({ id }).lean();
  if (!license) throw new Error('License not found.');

  return {
    id: license.id,
    customerName: license.customerName,
    activationKey: license.activationKey,
    keyLast4: license.keyLast4,
    status: license.status,
    maxDevices: license.maxDevices,
    notes: license.notes || '',
    createdAt: license.createdAt,
    activations: license.activations || []
  };
}

async function deactivateLicenseById(id) {
  await initDB();

  const license = await License.findOneAndUpdate(
    { id },
    { status: 'DEACTIVATED', deactivatedAt: nowIso() },
    { new: true }
  );

  if (!license) throw new Error('License not found.');

  return {
    id: license.id,
    status: license.status,
    deactivatedAt: license.deactivatedAt
  };
}

async function activateLicenseById(id) {
  await initDB();

  const license = await License.findOneAndUpdate(
    { id },
    { status: 'ACTIVE', activatedBackAt: nowIso() },
    { new: true }
  );

  if (!license) throw new Error('License not found.');

  return {
    id: license.id,
    status: license.status
  };
}

async function activateLicense({ activationKey, machineId, deviceName, ipAddress }) {
  await initDB();

  const safeMachineId = normalizeMachineId(machineId);
  if (!safeMachineId) throw new Error('machineId is required.');

  const keyHash = hashActivationKey(activationKey);
  const license = await License.findOne({ keyHash });

  if (!license) throw new Error('Invalid key.');
  if (license.status !== 'ACTIVE') throw new Error('License inactive.');

  const existing = license.activations.find(a => a.machineId === safeMachineId);

  if (!existing && license.activations.length >= license.maxDevices) {
    throw new Error('Max devices reached.');
  }

  if (existing) {
    existing.lastSeenAt = nowIso();
    existing.lastSeenIp = ipAddress;
  } else {
    license.activations.push({
      machineId: safeMachineId,
      deviceName,
      firstSeenIp: ipAddress,
      lastSeenIp: ipAddress,
      activatedAt: nowIso(),
      lastSeenAt: nowIso()
    });
  }

  await license.save();

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

async function validateTokenAndTouch({ token, machineId, ipAddress }) {
  await initDB();

  const payload = verifyToken(token);
  if (!payload) throw new Error('Invalid token.');

  const license = await License.findOne({ id: payload.licenseId });
  if (!license) throw new Error('License not found.');

  const activation = license.activations.find(a => a.machineId === machineId);
  if (!activation) throw new Error('Device not activated.');

  activation.lastSeenAt = nowIso();
  activation.lastSeenIp = ipAddress;

  await license.save();

  return { valid: true, keyLast4: license.keyLast4 };
}

async function deactivateLicense({ activationKey, machineId }) {
  await initDB();

  const keyHash = hashActivationKey(activationKey);
  const license = await License.findOne({ keyHash });

  if (!license) throw new Error('Invalid key.');

  license.activations = license.activations.filter(a => a.machineId !== machineId);

  await license.save();

  return { removed: true };
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
