-- Migration: Add granular address fields for Canadian addresses
-- Target: British Columbia, Canada properties
-- Date: 2025-07-07
-- Note: All existing properties are test data, safe to drop old address field

-- Add new address columns to properties table
ALTER TABLE properties 
ADD COLUMN street_address VARCHAR(255),         -- "123 Main Street", "1234A Oak Avenue"
ADD COLUMN unit VARCHAR(50),                    -- "Suite 401", "Unit B", "Apt 12"
ADD COLUMN city VARCHAR(100) NOT NULL,          -- "Vancouver", "Victoria", "Burnaby"
ADD COLUMN province VARCHAR(50) NOT NULL DEFAULT 'British Columbia', -- "British Columbia", "BC"
ADD COLUMN postal_code VARCHAR(7),              -- "V6B1A1" or "V6B 1A1" (Canadian format)
ADD COLUMN country VARCHAR(100) NOT NULL DEFAULT 'Canada',
ADD COLUMN latitude DECIMAL(10, 8),             -- For geocoding
ADD COLUMN longitude DECIMAL(11, 8),            -- For geocoding
ADD COLUMN formatted_address TEXT;              -- Full formatted address for display

-- Drop the old address column since it's test data
ALTER TABLE properties DROP COLUMN address;

-- Create indexes for common search patterns
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_province ON properties(province);
CREATE INDEX idx_properties_postal_code ON properties(postal_code);
CREATE INDEX idx_properties_location ON properties(latitude, longitude);

-- Add constraint for Canadian postal code format (flexible to handle both formats)
ALTER TABLE properties 
ADD CONSTRAINT chk_postal_code_format 
CHECK (postal_code IS NULL OR postal_code ~ '^[A-Z][0-9][A-Z][ ]?[0-9][A-Z][0-9]$');

-- Create function to automatically generate formatted_address
CREATE OR REPLACE FUNCTION update_formatted_address()
RETURNS TRIGGER AS $$
BEGIN
    NEW.formatted_address = TRIM(CONCAT_WS(', ',
        CASE 
            WHEN NEW.unit IS NOT NULL AND NEW.unit != '' 
            THEN CONCAT(NEW.street_address, ' ', NEW.unit)
            ELSE NEW.street_address
        END,
        NEW.city,
        NEW.province,
        NEW.postal_code,
        NEW.country
    ));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update formatted_address
CREATE TRIGGER trigger_update_formatted_address
    BEFORE INSERT OR UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_formatted_address();
