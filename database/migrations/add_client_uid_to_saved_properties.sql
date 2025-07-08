-- Add client_uid to saved_properties table
-- Date: 2025-07-07

BEGIN;

-- Add client_uid to saved_properties table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'saved_properties' AND column_name = 'client_uid'
    ) THEN
        ALTER TABLE saved_properties ADD COLUMN client_uid VARCHAR(36);
        
        -- Populate client_uid in saved_properties based on user_email
        UPDATE saved_properties sp
        SET client_uid = c.client_uid
        FROM clients c
        WHERE sp.user_email = c.email AND c.client_uid IS NOT NULL;
        
        -- Create index for better performance
        CREATE INDEX IF NOT EXISTS idx_saved_properties_client_uid ON saved_properties(client_uid);
        
        -- Add foreign key constraint
        ALTER TABLE saved_properties
        ADD CONSTRAINT fk_saved_properties_client_uid
        FOREIGN KEY (client_uid) REFERENCES clients(client_uid) ON DELETE CASCADE;
    END IF;
END $$;

-- Add unique constraint on (client_uid, property_uid) if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'saved_properties_client_uid_property_uid_key'
    ) THEN
        ALTER TABLE saved_properties 
        ADD CONSTRAINT saved_properties_client_uid_property_uid_key 
        UNIQUE (client_uid, property_uid);
    END IF;
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Could not add unique constraint on client_uid, property_uid. Constraint may already exist or data is not unique.';
END $$;

COMMIT;
