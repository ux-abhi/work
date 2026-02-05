const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// On Vercel, the filesystem is read-only except /tmp.
// Use /tmp for the DB file in serverless environments.
const isVercel = !!process.env.VERCEL;
const dataDir = isVercel ? '/tmp' : path.join(__dirname, 'data');

if (!isVercel && !fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(path.join(dataDir, 'smartlinks.db'));

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS smart_links (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL DEFAULT 'My Links',
    description TEXT DEFAULT '',
    template TEXT NOT NULL DEFAULT 'minimal',
    links TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    views INTEGER NOT NULL DEFAULT 0
  );

  CREATE INDEX IF NOT EXISTS idx_slug ON smart_links(slug);
`);

module.exports = db;
