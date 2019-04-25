PRAGMA foreign_keys = ON;

CREATE TABLE assessments (
  id TEXT NOT NULL, -- id of assessed snippet
  relevant INTEGER, -- boolean; if NULL, seen but not assessed
  userid INTEGER NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(userid) REFERENCES users(userid)
);

CREATE INDEX assessments_by_id ON assessments (id);

CREATE TABLE users (
  userid INTEGER PRIMARY KEY,
  username TEXT UNIQUE NOT NULL
);

CREATE INDEX users_by_username ON users (username);
