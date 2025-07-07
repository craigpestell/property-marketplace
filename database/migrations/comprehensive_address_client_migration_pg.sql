-- Comprehensive migration: Address fields + Client/Property relationship cleanup
-- Target: British Columbia, Canada properties
-- Date: 2025-01-07
-- Database: PostgreSQL
-- Note: All existing properties are test data and don't need address preservation

BEGIN;

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
-- First, drop the old address column since it contains test data
ALTER TABLE properties 
DROP COLUMN IF EXISTS address;

-- Add new granular address columns
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS street_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS street_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS unit VARCHAR(50),
ADD COLUMN IF NOT EXISTS city VARCHAR(100) NOT NULL DEFAULT 'Vancouver',
ADD COLUMN IF NOT EXISTS province VARCHAR(50) NOT NULL DEFAULT 'British Columbia',
ADD COLUMN IF NOT EXISTS postal_code VARCHAR(10),
ADD COLUMN IF NOT EXISTS country VARCHAR(100) NOT NULL DEFAULT 'Canada',
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS formatted_address TEXT,
ADD COLUMN IF NOT EXISTS address_type VARCHAR(20) DEFAULT 'residential',
ADD COLUMN IF NOT EXISTS client_uid VARCHAR(36);

-- Add check constraint for address_type
ALTER TABLE properties 
ADD CONSTRAINT chk_address_type 
CHECK (address_type IN ('residential', 'commercial', 'mixed'));

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
DROP COLUMN IF EXISTS user_email,
DROP COLUMN IF EXISTS client_email;

-- Make client_uid required
ALTER TABLE properties 
ALTER COLUMN client_uid SET NOT NULL;

-- Add foreign key constraint
ALTER TABLE properties 
ADD CONSTRAINT fk_properties_client_uid 
FOREIGN KEY (client_uid) REFERENCES clients(client_uid) 
ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 5: Create function for generating random address data
CREATE OR REPLACE FUNCTION generate_bc_address() RETURNS void AS $$
DECLARE
    street_names text[] := ARRAY[
        'Main Street', 'Oak Avenue', 'Pine Road', 'Maple Drive', 'Cedar Lane',
        'Elm Street', 'Birch Avenue', 'Willow Way', 'Cherry Street', 'Spruce Road',
        'Fir Avenue', 'Hemlock Street', 'Douglas Road', 'Granville Street', 'Robson Street',
        'Davie Street', 'Denman Street', 'Commercial Drive', 'Cambie Street', 'Fraser Street'
    ];
    bc_cities text[] := ARRAY[
        'Vancouver', 'Vancouver', 'Vancouver', 'Burnaby', 'Richmond',
        'Surrey', 'North Vancouver', 'West Vancouver', 'Coquitlam', 'New Westminster'
    ];
    postal_prefixes text[] := ARRAY['V5', 'V6', 'V7', 'V3', 'V4'];
    postal_chars text[] := ARRAY['A','B','C','E','G','H','J','K','L','M','N','P','R','S','T','V','W','X','Y','Z'];
    address_types text[] := ARRAY['residential', 'residential', 'commercial'];
BEGIN
    -- Update properties with realistic BC address data
    UPDATE properties 
    SET 
        street_number = (100 + FLOOR(RANDOM() * 9900))::text,
        street_name = street_names[1 + FLOOR(RANDOM() * array_length(street_names, 1))],
        unit = CASE 
            WHEN RANDOM() < 0.3 THEN 'Unit ' || (1 + FLOOR(RANDOM() * 50))::text
            WHEN RANDOM() < 0.2 THEN 'Apt ' || (1 + FLOOR(RANDOM() * 20))::text
            ELSE NULL
        END,
        city = bc_cities[1 + FLOOR(RANDOM() * array_length(bc_cities, 1))],
        postal_code = 
            postal_prefixes[1 + FLOOR(RANDOM() * array_length(postal_prefixes, 1))] ||
            postal_chars[1 + FLOOR(RANDOM() * array_length(postal_chars, 1))] ||
            FLOOR(RANDOM() * 10)::text || ' ' ||
            (1 + FLOOR(RANDOM() * 9))::text ||
            postal_chars[1 + FLOOR(RANDOM() * array_length(postal_chars, 1))] ||
            FLOOR(RANDOM() * 10)::text,
        address_type = address_types[1 + FLOOR(RANDOM() * array_length(address_types, 1))];
END;
$$ LANGUAGE plpgsql;

-- Step 6: Execute the address data generation
SELECT generate_bc_address();

-- Step 7: Generate formatted addresses
UPDATE properties 
SET formatted_address = CONCAT_WS(', ',
    CONCAT_WS(' ', street_number, street_name),
    CASE WHEN unit IS NOT NULL AND unit != '' THEN unit ELSE NULL END,
    city,
    province,
    postal_code,
    country
);

-- Step 8: Add approximate coordinates for major cities
UPDATE properties 
SET 
    latitude = CASE city
        WHEN 'Vancouver' THEN 49.2827 + (RANDOM() - 0.5) * 0.1
        WHEN 'Burnaby' THEN 49.2488 + (RANDOM() - 0.5) * 0.05
        WHEN 'Richmond' THEN 49.1666 + (RANDOM() - 0.5) * 0.05
        WHEN 'Surrey' THEN 49.1913 + (RANDOM() - 0.5) * 0.05
        WHEN 'North Vancouver' THEN 49.3163 + (RANDOM() - 0.5) * 0.03
        WHEN 'West Vancouver' THEN 49.3280 + (RANDOM() - 0.5) * 0.03
        WHEN 'Coquitlam' THEN 49.2838 + (RANDOM() - 0.5) * 0.03
        WHEN 'New Westminster' THEN 49.2057 + (RANDOM() - 0.5) * 0.03
        ELSE 49.2827 + (RANDOM() - 0.5) * 0.1
    END,
    longitude = CASE city
        WHEN 'Vancouver' THEN -123.1207 + (RANDOM() - 0.5) * 0.1
        WHEN 'Burnaby' THEN -122.9805 + (RANDOM() - 0.5) * 0.05
        WHEN 'Richmond' THEN -123.1336 + (RANDOM() - 0.5) * 0.05
        WHEN 'Surrey' THEN -122.8490 + (RANDOM() - 0.5) * 0.05
        WHEN 'North Vancouver' THEN -123.0926 + (RANDOM() - 0.5) * 0.03
        WHEN 'West Vancouver' THEN -123.1593 + (RANDOM() - 0.5) * 0.03
        WHEN 'Coquitlam' THEN -122.7932 + (RANDOM() - 0.5) * 0.03
        WHEN 'New Westminster' THEN -122.9110 + (RANDOM() - 0.5) * 0.03
        ELSE -123.1207 + (RANDOM() - 0.5) * 0.1
    END;

-- Step 9: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_province ON properties(province);
CREATE INDEX IF NOT EXISTS idx_properties_postal_code ON properties(postal_code);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_properties_client_uid ON properties(client_uid);

-- Step 10: Create search optimization column (using GIN index for full-text search)
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS search_location TEXT;

UPDATE properties 
SET search_location = CONCAT_WS(' ', 
    street_number, 
    street_name, 
    unit, 
    city, 
    province, 
    postal_code
);

CREATE INDEX IF NOT EXISTS idx_properties_search_location_gin 
ON properties USING GIN (to_tsvector('english', search_location));

-- Step 11: Add helpful comments
COMMENT ON COLUMN properties.street_number IS 'Street number, e.g., "123", "1234A"';
COMMENT ON COLUMN properties.street_name IS 'Street name, e.g., "Main Street", "Oak Avenue"';
COMMENT ON COLUMN properties.unit IS 'Unit/suite number, e.g., "Suite 401", "Unit B"';
COMMENT ON COLUMN properties.city IS 'City name, e.g., "Vancouver", "Victoria"';
COMMENT ON COLUMN properties.province IS 'Province/territory, default "British Columbia"';
COMMENT ON COLUMN properties.postal_code IS 'Canadian postal code, e.g., "V6B 1A1"';
COMMENT ON COLUMN properties.latitude IS 'Latitude for mapping and distance calculations';
COMMENT ON COLUMN properties.longitude IS 'Longitude for mapping and distance calculations';
COMMENT ON COLUMN properties.formatted_address IS 'Full formatted address for display purposes';
COMMENT ON COLUMN properties.client_uid IS 'Reference to clients table via client_uid';
COMMENT ON COLUMN clients.client_uid IS 'Unique identifier for client';

-- Clean up the function
DROP FUNCTION generate_bc_address();

-- Migration summary
SELECT 
    'Migration completed successfully!' as status,
    (SELECT COUNT(*) FROM properties) as total_properties,
    (SELECT COUNT(*) FROM clients) as total_clients,
    (SELECT COUNT(DISTINCT city) FROM properties) as unique_cities,
    (SELECT COUNT(*) FROM properties WHERE client_uid IS NOT NULL) as properties_with_client_uid;

COMMIT;
