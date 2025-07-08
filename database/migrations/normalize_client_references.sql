-- Normalize database to use client_uid instead of email addresses for relationships

-- First add client_uid to saved_properties table
ALTER TABLE saved_properties 
ADD COLUMN client_uid VARCHAR(36);

-- Update the client_uid in saved_properties based on user_email
UPDATE saved_properties sp
SET client_uid = c.client_uid
FROM clients c
WHERE sp.user_email = c.email;

-- Create an index for the new column
CREATE INDEX IF NOT EXISTS idx_saved_properties_client_uid ON saved_properties(client_uid);

-- Add a foreign key constraint to ensure data integrity
ALTER TABLE saved_properties
ADD CONSTRAINT fk_saved_properties_client_uid
FOREIGN KEY (client_uid) REFERENCES clients(client_uid) ON DELETE CASCADE;

-- Create a unique constraint on client_uid and property_uid
ALTER TABLE saved_properties
ADD CONSTRAINT saved_properties_client_uid_property_uid_key UNIQUE(client_uid, property_uid);

-- Add client_uid to user_notifications table
ALTER TABLE user_notifications
ADD COLUMN client_uid VARCHAR(36);

-- Update the client_uid in user_notifications based on user_email
UPDATE user_notifications un
SET client_uid = c.client_uid
FROM clients c
WHERE un.user_email = c.email;

-- Create an index for the new column
CREATE INDEX IF NOT EXISTS idx_user_notifications_client_uid ON user_notifications(client_uid);

-- Add a foreign key constraint to ensure data integrity
ALTER TABLE user_notifications
ADD CONSTRAINT fk_user_notifications_client_uid
FOREIGN KEY (client_uid) REFERENCES clients(client_uid) ON DELETE CASCADE;

-- Note: We're keeping user_email columns for now to maintain backward compatibility,
-- but in a future update we can make client_uid NOT NULL and eventually remove user_email
