-- Migration: Add offer_uid support
-- Run this script to add offer_uid columns to existing tables

-- Add offer_uid column to offers table
ALTER TABLE offers ADD COLUMN IF NOT EXISTS offer_uid VARCHAR(50) UNIQUE;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_offers_offer_uid ON offers(offer_uid);

-- Add offer_uid column to user_notifications table
ALTER TABLE user_notifications ADD COLUMN IF NOT EXISTS related_offer_uid VARCHAR(50);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_user_notifications_offer_uid ON user_notifications(related_offer_uid);

-- Note: After running this migration, you may want to:
-- 1. Generate UIDs for existing offers using the generateOfferUID() function
-- 2. Update existing notifications to include offer_uid where applicable
-- 3. Consider making offer_uid NOT NULL after populating existing records

-- Example query to populate offer_uid for existing offers:
-- UPDATE offers SET offer_uid = 'OFFER-' || UPPER(SUBSTRING(MD5(offer_id::text) FROM 1 FOR 8)) || '-' || offer_id WHERE offer_uid IS NULL;
