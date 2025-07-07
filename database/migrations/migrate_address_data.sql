-- Data migration script to parse existing addresses into granular fields
-- This script attempts to parse Canadian addresses for BC properties
-- Run after the schema migration

-- Function to help parse addresses (MySQL version)
DELIMITER //

CREATE TEMPORARY TABLE address_parsing_temp AS
SELECT 
    id,
    address,
    -- Extract postal code (Canadian format: A1A 1A1)
    CASE 
        WHEN address REGEXP '[A-Z][0-9][A-Z][ ]*[0-9][A-Z][0-9]$' THEN
            TRIM(SUBSTRING(address, -7))
        ELSE NULL
    END as extracted_postal_code,
    
    -- Extract city (word before postal code or province)
    CASE 
        WHEN address REGEXP '[A-Z][0-9][A-Z][ ]*[0-9][A-Z][0-9]$' THEN
            TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(address, SUBSTRING(address, -7), 1), ',', -1))
        WHEN address REGEXP '(BC|British Columbia)' THEN
            TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(address, 'BC', 1), ',', -1))
        ELSE 
            TRIM(SUBSTRING_INDEX(address, ',', -1))
    END as extracted_city,
    
    -- Extract street info (everything before city)
    CASE 
        WHEN address REGEXP '[A-Z][0-9][A-Z][ ]*[0-9][A-Z][0-9]$' THEN
            TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(address, TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(address, SUBSTRING(address, -7), 1), ',', -1)), 1), ',', 1))
        ELSE
            TRIM(SUBSTRING_INDEX(address, ',', 1))
    END as extracted_street
FROM properties 
WHERE address IS NOT NULL AND address != '';

-- Update properties with parsed data
UPDATE properties p
JOIN address_parsing_temp apt ON p.id = apt.id
SET 
    p.postal_code = apt.extracted_postal_code,
    p.city = COALESCE(apt.extracted_city, ''),
    p.province = 'British Columbia',
    p.country = 'Canada',
    p.formatted_address = p.address,
    -- Try to extract street number and name
    p.street_number = CASE 
        WHEN apt.extracted_street REGEXP '^[0-9]+' THEN
            TRIM(SUBSTRING_INDEX(apt.extracted_street, ' ', 1))
        ELSE NULL
    END,
    p.street_name = CASE 
        WHEN apt.extracted_street REGEXP '^[0-9]+' THEN
            TRIM(SUBSTRING(apt.extracted_street, LENGTH(SUBSTRING_INDEX(apt.extracted_street, ' ', 1)) + 2))
        ELSE apt.extracted_street
    END;

-- Clean up common BC cities (standardize naming)
UPDATE properties 
SET city = CASE 
    WHEN LOWER(city) IN ('vancouver', 'van') THEN 'Vancouver'
    WHEN LOWER(city) IN ('victoria', 'vic') THEN 'Victoria'
    WHEN LOWER(city) IN ('burnaby') THEN 'Burnaby'
    WHEN LOWER(city) IN ('richmond') THEN 'Richmond'
    WHEN LOWER(city) IN ('surrey') THEN 'Surrey'
    WHEN LOWER(city) IN ('langley') THEN 'Langley'
    WHEN LOWER(city) IN ('coquitlam') THEN 'Coquitlam'
    WHEN LOWER(city) IN ('north vancouver', 'north van', 'n vancouver', 'n van') THEN 'North Vancouver'
    WHEN LOWER(city) IN ('west vancouver', 'west van', 'w vancouver', 'w van') THEN 'West Vancouver'
    WHEN LOWER(city) IN ('new westminster', 'new west') THEN 'New Westminster'
    WHEN LOWER(city) IN ('port coquitlam', 'poco') THEN 'Port Coquitlam'
    WHEN LOWER(city) IN ('port moody') THEN 'Port Moody'
    WHEN LOWER(city) IN ('delta') THEN 'Delta'
    WHEN LOWER(city) IN ('white rock') THEN 'White Rock'
    WHEN LOWER(city) IN ('maple ridge') THEN 'Maple Ridge'
    WHEN LOWER(city) IN ('pitt meadows') THEN 'Pitt Meadows'
    WHEN LOWER(city) IN ('abbotsford') THEN 'Abbotsford'
    WHEN LOWER(city) IN ('chilliwack') THEN 'Chilliwack'
    WHEN LOWER(city) IN ('kelowna') THEN 'Kelowna'
    WHEN LOWER(city) IN ('kamloops') THEN 'Kamloops'
    WHEN LOWER(city) IN ('nanaimo') THEN 'Nanaimo'
    ELSE TRIM(INITCAP(city))
END
WHERE city IS NOT NULL AND city != '';

-- Clean up postal codes (ensure proper Canadian format)
UPDATE properties 
SET postal_code = UPPER(REPLACE(postal_code, ' ', ''))
WHERE postal_code IS NOT NULL 
AND postal_code REGEXP '[A-Za-z][0-9][A-Za-z][0-9][A-Za-z][0-9]';

-- Add space in postal code for proper Canadian format
UPDATE properties 
SET postal_code = CONCAT(
    SUBSTRING(postal_code, 1, 3), 
    ' ', 
    SUBSTRING(postal_code, 4, 3)
)
WHERE postal_code IS NOT NULL 
AND LENGTH(postal_code) = 6
AND postal_code REGEXP '[A-Z][0-9][A-Z][0-9][A-Z][0-9]';

-- Drop temporary table
DROP TEMPORARY TABLE address_parsing_temp;

-- Show migration results
SELECT 
    COUNT(*) as total_properties,
    COUNT(CASE WHEN city IS NOT NULL AND city != '' THEN 1 END) as properties_with_city,
    COUNT(CASE WHEN postal_code IS NOT NULL THEN 1 END) as properties_with_postal_code,
    COUNT(CASE WHEN street_name IS NOT NULL THEN 1 END) as properties_with_street_name
FROM properties;

-- Show city distribution
SELECT 
    city, 
    COUNT(*) as property_count 
FROM properties 
WHERE city IS NOT NULL AND city != '' 
GROUP BY city 
ORDER BY property_count DESC 
LIMIT 20;
