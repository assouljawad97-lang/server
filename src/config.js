const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const config = {
  port: Number(process.env.PORT || 8080),
  host: String(process.env.HOST || '0.0.0.0'),
  publicBaseUrl: String(process.env.PUBLIC_BASE_URL || 'http://127.0.0.1:8080'),
  activationSigningSecret: String(process.env.ACTIVATION_SIGNING_SECRET || 'dev-secret-change-me'),
  adminUsername: String(process.env.ADMIN_USERNAME || 'admin'),
  adminPassword: String(process.env.ADMIN_PASSWORD || ''),
  adminPasswordHash: String(process.env.ADMIN_PASSWORD_HASH || ''),
  adminSessionSecret: String(process.env.ADMIN_SESSION_SECRET || process.env.ACTIVATION_SIGNING_SECRET || 'dev-admin-session-secret'),
  adminSessionTtlMs: Number(process.env.ADMIN_SESSION_TTL_MS || 12 * 60 * 60 * 1000),
  adminLoginMaxAttempts: Number(process.env.ADMIN_LOGIN_MAX_ATTEMPTS || 8),
  adminLoginWindowMs: Number(process.env.ADMIN_LOGIN_WINDOW_MS || 15 * 60 * 1000),
  adminLoginBlockMs: Number(process.env.ADMIN_LOGIN_BLOCK_MS || 15 * 60 * 1000),
  dataFile: path.resolve(process.cwd(), process.env.DATA_FILE || './data/licenses.json'),
  downloadWindowsUrl: String(process.env.DOWNLOAD_WINDOWS_URL || '#'),
  downloadMacUrl: String(process.env.DOWNLOAD_MAC_URL || '#')
};

module.exports = { config };
