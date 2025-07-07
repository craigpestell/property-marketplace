-- Comprehensive migration: Address fields + Client/Property relationship cleanup
-- Target: British Columbia, Canada properties
-- Date: 2025-07-07
-- Note: All existing properties are test data and don't need address preservation

-- Step 1: Add client_uid to clients table
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS client_uid VARCHAR(36) UNIQUE;

-- Generate UUIDs for existing clients
UPDATE clients 
SET client_uid = gen_random_uuid()::text
WHERE client_uid IS NULL;

-- Make client_uid NOT NULL after populating
ALTER TABLE clients 
ALTER COLUMN client_uid SET NOT NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_clients_client_uid ON clients(client_uid);

-- Step 2: Add new address columns to properties table
ALTER TABLE properties 
DROP COLUMN IF EXISTS address;  -- Remove old address field since it's test data

ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS street_number VARCHAR(20),           -- "123", "1234A"
ADD COLUMN IF NOT EXISTS street_name VARCHAR(255),            -- "Main Street", "Oak Avenue"
ADD COLUMN IF NOT EXISTS unit VARCHAR(50),                    -- "Suite 401", "Unit B", "Apt 12"
ADD COLUMN IF NOT EXISTS city VARCHAR(100) NOT NULL DEFAULT 'Vancouver',  -- Default to Vancouver for BC
ADD COLUMN IF NOT EXISTS province VARCHAR(50) NOT NULL DEFAULT 'British Columbia',
ADD COLUMN IF NOT EXISTS postal_code VARCHAR(10),             -- "V6B 1A1" (Canadian format)
ADD COLUMN IF NOT EXISTS country VARCHAR(100) NOT NULL DEFAULT 'Canada',
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),             -- For geocoding
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),            -- For geocoding
ADD COLUMN IF NOT EXISTS formatted_address TEXT,              -- Full formatted address for display
ADD COLUMN IF NOT EXISTS address_type VARCHAR(20) DEFAULT 'residential' CHECK (address_type IN ('residential', 'commercial', 'mixed')),
ADD COLUMN IF NOT EXISTS client_uid VARCHAR(36);              -- New relationship field

-- Step 3: Populate client_uid in properties based on user_email
UPDATE properties 
SET client_uid = c.client_uid
FROM clients c
WHERE properties.user_email = c.email 
AND properties.user_email IS NOT NULL;

-- For properties without a matching user_email, assign a random client_uid
UPDATE properties 
SET client_uid = (
    SELECT c.client_uid 
    FROM clients c 
    ORDER BY RANDOM() 
    LIMIT 1
)
WHERE client_uid IS NULL;

-- Step 4: Clean up old columns and add constraints
ALTER TABLE properties 
DROP COLUMN user_email,              -- Remove old relationship field
DROP COLUMN client_email,            -- Remove redundant field
MODIFY COLUMN client_uid VARCHAR(36) NOT NULL;  -- Make required

-- Add foreign key constraint
ALTER TABLE properties 
ADD CONSTRAINT fk_properties_client_uid 
FOREIGN KEY (client_uid) REFERENCES clients(client_uid) 
ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 5: Populate test address data for BC properties
-- Generate realistic test addresses for Vancouver area
UPDATE properties 
SET 
    street_number = FLOOR(100 + RAND() * 9900),
    street_name = ELT(FLOOR(1 + RAND() * 20),
        'Main Street', 'Oak Avenue', 'Pine Road', 'Maple Drive', 'Cedar Lane',
        'Elm Street', 'Birch Avenue', 'Willow Way', 'Cherry Street', 'Spruce Road',
        'Fir Avenue', 'Hemlock Street', 'Douglas Road', 'Granville Street', 'Robson Street',
        'Davie Street', 'Denman Street', 'Commercial Drive', 'Cambie Street', 'Fraser Street'
    ),
    unit = CASE 
        WHEN RAND() < 0.3 THEN CONCAT('Unit ', FLOOR(1 + RAND() * 50))
        WHEN RAND() < 0.2 THEN CONCAT('Apt ', FLOOR(1 + RAND() * 20))
        ELSE NULL
    END,
    city = ELT(FLOOR(1 + RAND() * 10),
        'Vancouver', 'Vancouver', 'Vancouver', 'Burnaby', 'Richmond',
        'Surrey', 'North Vancouver', 'West Vancouver', 'Coquitlam', 'New Westminster'
    ),
    postal_code = CONCAT(
        ELT(FLOOR(1 + RAND() * 5), 'V5', 'V6', 'V7', 'V3', 'V4'),
        ELT(FLOOR(1 + RAND() * 26), 'A','B','C','E','G','H','J','K','L','M','N','P','R','S','T','V','W','X','Y','Z'),
        FLOOR(RAND() * 10),
        ' ',
        FLOOR(1 + RAND() * 9),
        ELT(FLOOR(1 + RAND() * 26), 'A','B','C','E','G','H','J','K','L','M','N','P','R','S','T','V','W','X','Y','Z'),
        FLOOR(RAND() * 10)
    ),
    address_type = ELT(FLOOR(1 + RAND() * 3), 'residential', 'residential', 'commercial');

-- Step 6: Generate formatted addresses
UPDATE properties 
SET formatted_address = CONCAT_WS(', ',
    CONCAT_WS(' ', street_number, street_name),
    unit,
    city,
    province,
    postal_code,
    country
);

-- Step 7: Add approximate coordinates for major cities
UPDATE properties 
SET 
    latitude = CASE city
        WHEN 'Vancouver' THEN 49.2827 + (RAND() - 0.5) * 0.1
        WHEN 'Burnaby' THEN 49.2488 + (RAND() - 0.5) * 0.05
        WHEN 'Richmond' THEN 49.1666 + (RAND() - 0.5) * 0.05
        WHEN 'Surrey' THEN 49.1913 + (RAND() - 0.5) * 0.05
        WHEN 'North Vancouver' THEN 49.3163 + (RAND() - 0.5) * 0.03
        WHEN 'West Vancouver' THEN 49.3280 + (RAND() - 0.5) * 0.03
        WHEN 'Coquitlam' THEN 49.2838 + (RAND() - 0.5) * 0.03
        WHEN 'New Westminster' THEN 49.2057 + (RAND() - 0.5) * 0.03
        ELSE 49.2827 + (RAND() - 0.5) * 0.1
    END,
    longitude = CASE city
        WHEN 'Vancouver' THEN -123.1207 + (RAND() - 0.5) * 0.1
        WHEN 'Burnaby' THEN -122.9805 + (RAND() - 0.5) * 0.05
        WHEN 'Richmond' THEN -123.1336 + (RAND() - 0.5) * 0.05
        WHEN 'Surrey' THEN -122.8490 + (RAND() - 0.5) * 0.05
        WHEN 'North Vancouver' THEN -123.0926 + (RAND() - 0.5) * 0.03
        WHEN 'West Vancouver' THEN -123.1593 + (RAND() - 0.5) * 0.03
        WHEN 'Coquitlam' THEN -122.7932 + (RAND() - 0.5) * 0.03
        WHEN 'New Westminster' THEN -122.9110 + (RAND() - 0.5) * 0.03
        ELSE -123.1207 + (RAND() - 0.5) * 0.1
    END;

-- Step 8: Create indexes for performance
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_province ON properties(province);
CREATE INDEX idx_properties_postal_code ON properties(postal_code);
CREATE INDEX idx_properties_location ON properties(latitude, longitude);
CREATE INDEX idx_properties_client_uid ON properties(client_uid);

-- Step 9: Create search optimization column
ALTER TABLE properties 
ADD COLUMN search_location VARCHAR(500) GENERATED ALWAYS AS (
    CONCAT_WS(', ', 
        NULLIF(CONCAT_WS(' ', street_number, street_name), ''), 
        NULLIF(unit, ''), 
        NULLIF(city, ''), 
        NULLIF(province, ''), 
        NULLIF(postal_code, '')
    )
) STORED;

CREATE FULLTEXT INDEX idx_properties_search_location ON properties(search_location);

-- Step 10: Add helpful comments
ALTER TABLE properties 
MODIFY COLUMN street_number VARCHAR(20) COMMENT 'Street number, e.g., "123", "1234A"',
MODIFY COLUMN street_name VARCHAR(255) COMMENT 'Street name, e.g., "Main Street", "Oak Avenue"',
MODIFY COLUMN unit VARCHAR(50) COMMENT 'Unit/suite number, e.g., "Suite 401", "Unit B"',
MODIFY COLUMN city VARCHAR(100) COMMENT 'City name, e.g., "Vancouver", "Victoria"',
MODIFY COLUMN province VARCHAR(50) COMMENT 'Province/territory, default "British Columbia"',
MODIFY COLUMN postal_code VARCHAR(10) COMMENT 'Canadian postal code, e.g., "V6B 1A1"',
MODIFY COLUMN latitude DECIMAL(10, 8) COMMENT 'Latitude for mapping and distance calculations',
MODIFY COLUMN longitude DECIMAL(11, 8) COMMENT 'Longitude for mapping and distance calculations',
MODIFY COLUMN formatted_address TEXT COMMENT 'Full formatted address for display purposes',
MODIFY COLUMN client_uid VARCHAR(36) COMMENT 'Reference to clients table via client_uid';

ALTER TABLE clients
MODIFY COLUMN client_uid VARCHAR(36) COMMENT 'Unique identifier for client';

-- Migration summary
SELECT 
    'Migration completed successfully!' as status,
    (SELECT COUNT(*) FROM properties) as total_properties,
    (SELECT COUNT(*) FROM clients) as total_clients,
    (SELECT COUNT(DISTINCT city) FROM properties) as unique_cities,
    (SELECT COUNT(*) FROM properties WHERE client_uid IS NOT NULL) as properties_with_client_uid;
