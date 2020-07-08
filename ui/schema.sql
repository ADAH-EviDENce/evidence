PRAGMA foreign_keys = ON;

CREATE TABLE assessments (
  id TEXT NOT NULL, -- id of assessed snippet
  relevant INTEGER, -- boolean; if NULL, seen but not assessed
  userid INTEGER NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id, userid),
  FOREIGN KEY(userid) REFERENCES users(userid)
) WITHOUT ROWID;

-- Seed set of snippets.
CREATE TABLE seed (
  id TEXT NOT NULL,
  userid INTEGER NOT NULL,
  PRIMARY KEY(id, userid)
) WITHOUT ROWID;

CREATE TABLE users (
  userid INTEGER PRIMARY KEY,
  username TEXT UNIQUE NOT NULL
);
