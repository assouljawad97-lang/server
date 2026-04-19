const { createHmac } = require('crypto');
const { config } = require('./config');

function toBase64Url(text) {
  return Buffer.from(String(text || ''), 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function fromBase64Url(value) {
  const normalized = String(value || '')
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const padLength = (4 - (normalized.length % 4)) % 4;
  return Buffer.from(normalized + '='.repeat(padLength), 'base64').toString('utf8');
}

function signToken(payload) {
  const encodedPayload = toBase64Url(JSON.stringify(payload || {}));
  const signature = createHmac('sha256', config.activationSigningSecret)
    .update(encodedPayload)
    .digest('hex');
  return `${encodedPayload}.${signature}`;
}

function verifyToken(token) {
  const text = String(token || '').trim();
  if (!text || !text.includes('.')) return null;
  const [encodedPayload, signature] = text.split('.');
  if (!encodedPayload || !signature) return null;
  const expected = createHmac('sha256', config.activationSigningSecret)
    .update(encodedPayload)
    .digest('hex');
  if (expected !== signature) return null;
  try {
    return JSON.parse(fromBase64Url(encodedPayload));
  } catch (error) {
    return null;
  }
}

module.exports = {
  signToken,
  verifyToken
};

