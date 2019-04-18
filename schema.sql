CREATE TABLE assessments (
  id TEXT NOT NULL,
  relevant INTEGER, -- boolean; if NULL, seen but not assessed
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
