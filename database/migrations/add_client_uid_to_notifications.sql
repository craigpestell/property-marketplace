-- Add client_uid to user_notifications table
-- Date: 2025-07-07

BEGIN;

-- Add client_uid to user_notifications table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'user_notifications' AND column_name = 'client_uid'
    ) THEN
        ALTER TABLE user_notifications ADD COLUMN client_uid VARCHAR(36);
        
        -- Populate client_uid in user_notifications based on user_email
        UPDATE user_notifications n
        SET client_uid = c.client_uid
        FROM clients c
        WHERE n.user_email = c.email AND c.client_uid IS NOT NULL;
        
        -- Create index for better performance
        CREATE INDEX IF NOT EXISTS idx_user_notifications_client_uid ON user_notifications(client_uid);
        
        -- Add foreign key constraint
        ALTER TABLE user_notifications
        ADD CONSTRAINT fk_user_notifications_client_uid
        FOREIGN KEY (client_uid) REFERENCES clients(client_uid) ON DELETE CASCADE;
    END IF;
END $$;

-- Add related_client_uid column to user_notifications table to track the sender's client_uid
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'user_notifications' AND column_name = 'related_client_uid'
    ) THEN
        ALTER TABLE user_notifications ADD COLUMN related_client_uid VARCHAR(36);
        
        -- Add foreign key constraint
        ALTER TABLE user_notifications
        ADD CONSTRAINT fk_user_notifications_related_client_uid
        FOREIGN KEY (related_client_uid) REFERENCES clients(client_uid) ON DELETE SET NULL;
    END IF;
END $$;

COMMIT;
