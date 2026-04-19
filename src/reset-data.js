const fs = require('fs');
const path = require('path');
const { config } = require('./config');

const folder = path.dirname(config.dataFile);
if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder, { recursive: true });
}

const emptyDb = {
  version: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  licenses: []
};

fs.writeFileSync(config.dataFile, JSON.stringify(emptyDb, null, 2), 'utf8');
console.log(`Data reset completed: ${config.dataFile}`);

