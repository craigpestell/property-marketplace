-- Create showings table
CREATE TABLE IF NOT EXISTS showings (
  id SERIAL PRIMARY KEY,
  property_uid VARCHAR(64) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  user_name VARCHAR(128),
  user_email VARCHAR(256),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
-- Index for fast lookup by property
CREATE INDEX IF NOT EXISTS idx_showings_property_uid ON showings(property_uid);
