-- Migration: Add client_uid to offers table
-- This adds the seller_client_uid and buyer_client_uid columns to the offers table
-- and creates the appropriate indexes for them

BEGIN;

-- Add client_uid columns to offers table
ALTER TABLE offers ADD COLUMN IF NOT EXISTS seller_client_uid UUID;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS buyer_client_uid UUID;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_offers_seller_client_uid ON offers(seller_client_uid);
CREATE INDEX IF NOT EXISTS idx_offers_buyer_client_uid ON offers(buyer_client_uid);

-- Update existing records where possible
-- This will populate seller_client_uid based on the seller_email
UPDATE offers o
SET seller_client_uid = c.client_uid::uuid
FROM clients c
WHERE o.seller_email = c.email AND o.seller_client_uid IS NULL;

-- This will populate buyer_client_uid based on the buyer_email
UPDATE offers o
SET buyer_client_uid = c.client_uid::uuid
FROM clients c
WHERE o.buyer_email = c.email AND o.buyer_client_uid IS NULL;

-- Add foreign key constraints
-- We'll skip foreign key constraints for now since there seems to be 
-- a type mismatch between offers.seller_client_uid (UUID) and clients.client_uid (VARCHAR)
-- TODO: Revisit after confirming the correct data types

-- Instead, let's create a comment to document the intention
COMMENT ON COLUMN offers.seller_client_uid IS 'References clients.client_uid but constraint skipped due to type mismatch';
COMMENT ON COLUMN offers.buyer_client_uid IS 'References clients.client_uid but constraint skipped due to type mismatch';

COMMIT;

-- Note: After running this migration, you should update the offers API endpoints
-- to use the client_uid fields when available.
