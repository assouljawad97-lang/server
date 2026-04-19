const { randomUUID, createHash } = require('crypto');
const mongoose = require('mongoose');
const { connectDB } = require('./db');

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
  activations: Array
});

const License = mongoose.models.License || mongoose.model('License', licenseSchema);

async function readDb() {
  await connectDB();
  const licenses = await License.find().lean();
  return { licenses };
}

async function writeDb(db) {
  await connectDB();

  await License.deleteMany({});
  if (db.licenses?.length) {
    await License.insertMany(db.licenses);
  }
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
  readDb,
  writeDb,
  hashActivationKey,
  generateActivationKey
};
