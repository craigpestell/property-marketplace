-- Migration: Add user_email column to properties table
-- This allows for direct email-based property ownership tracking

-- Add user_email column to properties table
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS user_email VARCHAR(255);

-- Create an index on user_email for better query performance
CREATE INDEX IF NOT EXISTS idx_properties_user_email ON properties(user_email);

-- Populate existing records with email from clients table (if data exists)
UPDATE properties 
SET user_email = (
  SELECT email 
  FROM clients 
  WHERE clients.id = properties.client_id
) 
WHERE user_email IS NULL AND client_id IS NOT NULL;

-- Optional: Add a foreign key constraint (uncomment if needed)
-- ALTER TABLE properties 
-- ADD CONSTRAINT fk_properties_user_email 
-- FOREIGN KEY (user_email) REFERENCES clients(email);

-- Verify the column was added
\d properties;
