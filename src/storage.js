const fs = require('fs');
const path = require('path');
const { randomUUID, createHash } = require('crypto');
const { config } = require('./config');

function ensureDataFile() {
  const folder = path.dirname(config.dataFile);
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
  if (!fs.existsSync(config.dataFile)) {
    const initial = {
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      licenses: []
    };
    fs.writeFileSync(config.dataFile, JSON.stringify(initial, null, 2), 'utf8');
  }
}

function readDb() {
  ensureDataFile();
  const raw = fs.readFileSync(config.dataFile, 'utf8');
  const db = JSON.parse(raw || '{}');
  db.licenses = Array.isArray(db.licenses) ? db.licenses : [];
  return db;
}

function writeDb(db) {
  const next = {
    ...db,
    updatedAt: new Date().toISOString()
  };
  fs.writeFileSync(config.dataFile, JSON.stringify(next, null, 2), 'utf8');
}

function hashActivationKey(key) {
  return createHash('sha256').update(String(key || '').trim().toUpperCase()).digest('hex');
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

