const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

function readBool(value, fallback = false) {
  if (value == null) return fallback;
  const normalized = String(value).trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes';
}

function getMailConfig() {
  return {
    host: String(process.env.SMTP_HOST || '').trim(),
    port: Number(process.env.SMTP_PORT || 587),
    secure: readBool(process.env.SMTP_SECURE, false),
    user: String(process.env.SMTP_USER || '').trim(),
    pass: String(process.env.SMTP_PASS || '').trim(),
    from: String(process.env.MAIL_FROM || '').trim()
  };
}

function isMailConfigured() {
  const cfg = getMailConfig();
  return Boolean(cfg.host && cfg.port && cfg.user && cfg.pass && cfg.from);
}

function createTransporter() {
  const cfg = getMailConfig();
  if (!isMailConfigured()) {
    throw new Error('Email service is not configured. Please check SMTP env variables.');
  }
  return nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: {
      user: cfg.user,
      pass: cfg.pass
    }
  });
}

async function sendOrderEmail({ to, subject, message, activationKey }) {
  const transporter = createTransporter();
  const cfg = getMailConfig();
  const safeTo = String(to || '').trim();
  if (!safeTo) {
    throw new Error('Recipient email is missing.');
  }
  const safeSubject = String(subject || '').trim() || 'Officino Response';
  const safeMessage = String(message || '').trim();
  const safeKey = String(activationKey || '').trim();

  const text = safeKey
    ? `${safeMessage}\n\nActivation Key: ${safeKey}`
    : safeMessage;

  const logoPath = path.resolve(process.cwd(), 'public', 'logo.png');
  const hasLogo = fs.existsSync(logoPath);
  const html = `
    <div style="font-family: Arial, sans-serif; color: #1f2a44; line-height: 1.55;">
      ${hasLogo ? `
      <div style="margin-bottom: 16px;">
        <img src="cid:officino-logo" alt="Officino" style="height: 54px; width: auto; display: block;" />
      </div>
      ` : ''}
      <p>${safeMessage.replace(/\n/g, '<br/>')}</p>
      ${safeKey ? `<p><strong>Activation Key:</strong> <code>${safeKey}</code></p>` : ''}
      <p style="margin-top: 24px;">Officino Support</p>
    </div>
  `;

  const attachments = [];
  if (hasLogo) {
    attachments.push({
      filename: 'logo.png',
      path: logoPath,
      cid: 'officino-logo'
    });
  }

  const info = await transporter.sendMail({
    from: cfg.from,
    to: safeTo,
    subject: safeSubject,
    text,
    html,
    attachments
  });

  return {
    messageId: String(info.messageId || ''),
    accepted: Array.isArray(info.accepted) ? info.accepted : []
  };
}

module.exports = {
  isMailConfigured,
  sendOrderEmail
};
