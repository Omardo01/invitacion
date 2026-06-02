import Database from "better-sqlite3";
import path from "path";
import { mkdirSync } from "fs";

const DB_PATH = path.join(process.cwd(), "data", "wedding.db");
mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS guests (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    slug        TEXT    UNIQUE NOT NULL,
    name        TEXT    NOT NULL,
    seats       INTEGER NOT NULL DEFAULT 1,
    phone       TEXT,
    confirmed   INTEGER DEFAULT NULL,   -- NULL=pendiente, 1=sí, 0=no
    confirmed_at TEXT   DEFAULT NULL,
    notes       TEXT    DEFAULT NULL,
    created_at  TEXT    DEFAULT (datetime('now','localtime'))
  );
`);

export default db;
