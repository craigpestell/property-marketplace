-- Script to populate offer_uid for existing offers and create test data
-- This script should be run after the migration to ensure all offers have UIDs

-- Update existing offers without UIDs
UPDATE offers 
SET offer_uid = 'OFFER-' || UPPER(SUBSTRING(MD5(offer_id::text) FROM 1 FOR 8)) || '-' || offer_id 
WHERE offer_uid IS NULL;

-- Make offer_uid NOT NULL now that all records have values
ALTER TABLE offers ALTER COLUMN offer_uid SET NOT NULL;

-- Update counter_offers to include original_offer_uid
UPDATE counter_offers 
SET original_offer_uid = (
    SELECT offer_uid 
    FROM offers 
    WHERE offers.offer_id = counter_offers.original_offer_id
)
WHERE original_offer_uid IS NULL;

-- Update user_notifications to include related_offer_uid
UPDATE user_notifications 
SET related_offer_uid = (
    SELECT offer_uid 
    FROM offers 
    WHERE offers.offer_id = user_notifications.related_offer_id
)
WHERE related_offer_id IS NOT NULL AND related_offer_uid IS NULL;

-- Show summary of updates
SELECT 
    'Offers with UIDs' as description,
    COUNT(*) as count
FROM offers 
WHERE offer_uid IS NOT NULL

UNION ALL

SELECT 
    'Counter offers with UIDs' as description,
    COUNT(*) as count
FROM counter_offers 
WHERE original_offer_uid IS NOT NULL

UNION ALL

SELECT 
    'Notifications with offer UIDs' as description,
    COUNT(*) as count
FROM user_notifications 
WHERE related_offer_uid IS NOT NULL;
