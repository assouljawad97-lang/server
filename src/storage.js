const { randomUUID, createHash } = require('crypto');
const mongoose = require('mongoose');
const { connectDB } = require('./db');

const activationSchema = new mongoose.Schema({
  machineId: String,
  deviceName: String,
  firstSeenIp: String,
  lastSeenIp: String,
  activatedAt: String,
  lastSeenAt: String
}, { _id: false });

const licenseSchema = new mongoose.Schema({
  id: String,
  activationKey: String,
  keyHash: String,
  keyLast4: String,
  customerName: String,
  maxDevices: Number,
  status: String,
  notes: String,
  createdAt: String,
  deactivatedAt: String,
  activatedBackAt: String,
  activations: [activationSchema]
});

const License = mongoose.models.License || mongoose.model('License', licenseSchema);

async function initDB() {
  await connectDB();
}

function hashActivationKey(key) {
  return createHash('sha256')
    .update(String(key || '').trim().toUpperCase())
    .digest('hex');
}

function generateActivationKey() {
  const block = () => randomUUID().replace(/-/g, '').slice(0, 4).toUpperCase();
  return `${block()}-${block()}-${block()}-${block()}`;
}

module.exports = {
  License,
  initDB,
  hashActivationKey,
  generateActivationKey
};
