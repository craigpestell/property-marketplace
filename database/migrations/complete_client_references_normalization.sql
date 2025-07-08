-- Complete client references normalization
-- This script completes the normalization of database tables to use client_uid instead of email addresses
-- for client/user relationships, while maintaining backward compatibility
-- Date: 2025-07-07

BEGIN;

-- Step 1: Make sure client_uid is NOT NULL in the clients table
ALTER TABLE clients 
ALTER COLUMN client_uid SET NOT NULL;

-- Step 2: Add client_uid and viewer_client_uid to showings table if they don't exist
DO $$ 
BEGIN
    -- Add client_uid for the property owner
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'showings' AND column_name = 'client_uid'
    ) THEN
        ALTER TABLE showings ADD COLUMN client_uid VARCHAR(36);
        
        -- Populate client_uid in showings based on property's client_uid
        UPDATE showings s
        SET client_uid = p.client_uid
        FROM properties p
        WHERE s.property_uid = p.property_uid AND p.client_uid IS NOT NULL;
        
        -- Create index for better performance
        CREATE INDEX IF NOT EXISTS idx_showings_client_uid ON showings(client_uid);
        
        -- Add foreign key constraint
        ALTER TABLE showings
        ADD CONSTRAINT fk_showings_client_uid
        FOREIGN KEY (client_uid) REFERENCES clients(client_uid) ON DELETE CASCADE;
    END IF;
    
    -- Add viewer_client_uid for the person viewing the property
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'showings' AND column_name = 'viewer_client_uid'
    ) THEN
        ALTER TABLE showings ADD COLUMN viewer_client_uid VARCHAR(36);
        
        -- Populate viewer_client_uid in showings based on user_email
        UPDATE showings s
        SET viewer_client_uid = c.client_uid
        FROM clients c
        WHERE s.user_email = c.email AND c.client_uid IS NOT NULL;
        
        -- Create index for better performance
        CREATE INDEX IF NOT EXISTS idx_showings_viewer_client_uid ON showings(viewer_client_uid);
        
        -- Add foreign key constraint
        ALTER TABLE showings
        ADD CONSTRAINT fk_showings_viewer_client_uid
        FOREIGN KEY (viewer_client_uid) REFERENCES clients(client_uid) ON DELETE SET NULL;
    END IF;
END $$;

-- Step 3: Add client_uid to offers table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'offers' AND column_name = 'client_uid'
    ) THEN
        ALTER TABLE offers ADD COLUMN client_uid VARCHAR(36);
        
        -- Populate client_uid in offers based on property's client_uid
        UPDATE offers o
        SET client_uid = p.client_uid
        FROM properties p
        WHERE o.property_uid = p.property_uid AND p.client_uid IS NOT NULL;
        
        -- Create index for better performance
        CREATE INDEX IF NOT EXISTS idx_offers_client_uid ON offers(client_uid);
        
        -- Add foreign key constraint
        ALTER TABLE offers
        ADD CONSTRAINT fk_offers_client_uid
        FOREIGN KEY (client_uid) REFERENCES clients(client_uid) ON DELETE CASCADE;
    END IF;
END $$;

-- Step 4: Add buyer_client_uid to offers table to reference the buyer
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'offers' AND column_name = 'buyer_client_uid'
    ) THEN
        ALTER TABLE offers ADD COLUMN buyer_client_uid VARCHAR(36);
        
        -- Populate buyer_client_uid in offers based on buyer_email
        UPDATE offers o
        SET buyer_client_uid = c.client_uid
        FROM clients c
        WHERE o.buyer_email = c.email AND c.client_uid IS NOT NULL;
        
        -- Create index for better performance
        CREATE INDEX IF NOT EXISTS idx_offers_buyer_client_uid ON offers(buyer_client_uid);
        
        -- Add foreign key constraint
        ALTER TABLE offers
        ADD CONSTRAINT fk_offers_buyer_client_uid
        FOREIGN KEY (buyer_client_uid) REFERENCES clients(client_uid) ON DELETE CASCADE;
    END IF;
END $$;

-- Step 5: Add client_uid to properties table if it doesn't exist or isn't populated
DO $$ 
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'client_uid'
    ) THEN
        -- If client_uid column exists but some rows have NULL values, populate them from user_email
        UPDATE properties p
        SET client_uid = c.client_uid
        FROM clients c
        WHERE p.user_email = c.email AND p.client_uid IS NULL AND c.client_uid IS NOT NULL;
    ELSE
        -- If client_uid column doesn't exist, create it
        ALTER TABLE properties ADD COLUMN client_uid VARCHAR(36);
        
        -- Populate client_uid in properties based on user_email
        UPDATE properties p
        SET client_uid = c.client_uid
        FROM clients c
        WHERE p.user_email = c.email AND c.client_uid IS NOT NULL;
        
        -- Create index for better performance
        CREATE INDEX IF NOT EXISTS idx_properties_client_uid ON properties(client_uid);
        
        -- Add foreign key constraint
        ALTER TABLE properties
        ADD CONSTRAINT fk_properties_client_uid
        FOREIGN KEY (client_uid) REFERENCES clients(client_uid) ON DELETE CASCADE;
    END IF;
END $$;

-- Step 6: Add additional indexes for query optimization
CREATE INDEX IF NOT EXISTS idx_offers_property_uid ON offers(property_uid);
CREATE INDEX IF NOT EXISTS idx_showings_property_uid ON showings(property_uid);
CREATE INDEX IF NOT EXISTS idx_saved_properties_property_uid ON saved_properties(property_uid);
CREATE INDEX IF NOT EXISTS idx_user_notifications_property_uid ON user_notifications(related_property_uid);

-- Note: We're keeping email-based columns for backward compatibility,
-- but in a future update we can make client_uid NOT NULL in all tables
-- and eventually remove email-based columns and references

COMMIT;
