const { randomBytes, pbkdf2Sync } = require('crypto');

const password = String(process.argv[2] || '').trim();
if (!password) {
  console.error('Usage: node src/generate-admin-password-hash.js "YourStrongPassword"');
  process.exit(1);
}

const iterations = 210000;
const salt = randomBytes(16).toString('hex');
const digest = pbkdf2Sync(password, salt, iterations, 32, 'sha256').toString('hex');
console.log(`pbkdf2_sha256$${iterations}$${salt}$${digest}`);
