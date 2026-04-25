const fs = require('fs');
const path = require('path');

const dataDir = path.resolve(process.cwd(), 'data');
const logFilePath = path.join(dataDir, 'server-logs.ndjson');
const maxBytes = 2 * 1024 * 1024;
const keepTailBytes = 1 * 1024 * 1024;

function ensureLogFile() {
  fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, '', 'utf8');
  }
}

function trimIfNeeded() {
  try {
    const stat = fs.statSync(logFilePath);
    if (stat.size <= maxBytes) return;
    const fd = fs.openSync(logFilePath, 'r');
    const start = Math.max(0, stat.size - keepTailBytes);
    const buffer = Buffer.alloc(stat.size - start);
    fs.readSync(fd, buffer, 0, buffer.length, start);
    fs.closeSync(fd);
    fs.writeFileSync(logFilePath, buffer, 'utf8');
  } catch (error) {
    // ignore trimming errors
  }
}

function safeMeta(meta) {
  if (!meta) return null;
  if (meta instanceof Error) {
    return { message: meta.message, stack: meta.stack };
  }
  if (typeof meta === 'object') return meta;
  return { value: String(meta) };
}

function logServerEvent(level, message, meta) {
  try {
    ensureLogFile();
    const row = {
      ts: new Date().toISOString(),
      level: String(level || 'info').toUpperCase(),
      message: String(message || ''),
      meta: safeMeta(meta)
    };
    fs.appendFileSync(logFilePath, `${JSON.stringify(row)}\n`, 'utf8');
    trimIfNeeded();
  } catch (error) {
    // avoid recursive logger failures
  }
}

function readServerLogs({ level = '', limit = 200 } = {}) {
  ensureLogFile();
  const raw = fs.readFileSync(logFilePath, 'utf8');
  const filterLevel = String(level || '').trim().toUpperCase();
  const rows = raw
    .split(/\r?\n/g)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        return null;
      }
    })
    .filter(Boolean)
    .filter((row) => !filterLevel || String(row.level || '').toUpperCase() === filterLevel);
  rows.sort((a, b) => String(b.ts || '').localeCompare(String(a.ts || '')));
  return rows.slice(0, Math.max(1, Math.min(1000, Number(limit) || 200)));
}

function getLogInfo() {
  ensureLogFile();
  return { logFilePath };
}

module.exports = {
  logServerEvent,
  readServerLogs,
  getLogInfo
};

