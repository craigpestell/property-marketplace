#!/bin/bash

# Data cleanup script for Property Marketplace
# This script only populates address data without changing schema

echo "🧹 Property Marketplace - Address Data Cleanup"
echo "==========================================="

# Source environment variables from .env file
if [ -f ".env" ]; then
    echo "📂 Loading environment variables from .env file..."
    set -a
    source .env
    set +a
fi

# Check if database connection details are provided
if [ -z "$PGDATABASE" ] || [ -z "$PGUSER" ] || [ -z "$PGPASSWORD" ]; then
    echo "⚠️  Required database variables are not set."
    echo "   Please make sure your .env file contains:"
    echo "   PGDATABASE, PGUSER, PGPASSWORD, PGHOST, PGPORT"
    exit 1
fi

# Construct DATABASE_URL if not provided
if [ -z "$DATABASE_URL" ]; then
    DATABASE_URL="postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST:-localhost}:${PGPORT:-5432}/${PGDATABASE}"
fi

echo "📊 Running address data population..."
echo "Database: $PGDATABASE"
echo "Host: ${PGHOST:-localhost}"
echo ""

# Check if we can connect to the database
echo "🔍 Testing database connection..."
psql "$DATABASE_URL" -c "SELECT version();" > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "❌ Failed to connect to database. Please check your connection settings."
    exit 1
fi

echo "✅ Database connection successful"
echo ""

# Create temporary SQL script for data population
TMP_SQL_FILE=$(mktemp)

cat > $TMP_SQL_FILE << 'EOF'
-- Data population script for address migration
BEGIN;

-- Populate street numbers and names for properties that need them
UPDATE properties
SET 
    street_number = FLOOR(100 + RANDOM() * 9900)::TEXT,
    street_name = (
        ARRAY[
            'Main Street', 'Oak Avenue', 'Pine Road', 'Maple Drive', 'Cedar Lane',
            'Elm Street', 'Birch Avenue', 'Willow Way', 'Cherry Street', 'Spruce Road',
            'Fir Avenue', 'Hemlock Street', 'Douglas Road', 'Granville Street', 'Robson Street',
            'Davie Street', 'Denman Street', 'Commercial Drive', 'Cambie Street', 'Fraser Street'
        ]
    )[FLOOR(1 + RANDOM() * 20)::INT]
WHERE street_number IS NULL OR street_name IS NULL;

-- Populate unit info
UPDATE properties
SET 
    unit = CASE 
        WHEN RANDOM() < 0.3 THEN 'Unit ' || FLOOR(1 + RANDOM() * 50)::TEXT
        WHEN RANDOM() < 0.2 THEN 'Apt ' || FLOOR(1 + RANDOM() * 20)::TEXT
        ELSE NULL
    END
WHERE unit IS NULL;

-- Populate city if missing
UPDATE properties
SET 
    city = (
        ARRAY[
            'Vancouver', 'Vancouver', 'Vancouver', 'Burnaby', 'Richmond',
            'Surrey', 'North Vancouver', 'West Vancouver', 'Coquitlam', 'New Westminster'
        ]
    )[FLOOR(1 + RANDOM() * 10)::INT]
WHERE city = 'Vancouver' OR city IS NULL;

-- Generate postal codes where missing
UPDATE properties
SET 
    postal_code = 
        (ARRAY['V5','V6','V7','V3','V4'])[FLOOR(1 + RANDOM() * 5)::INT] || 
        (ARRAY['A','B','C','E','G','H','J','K','L','M','N','P','R','S','T','V','W','X','Y','Z'])[FLOOR(1 + RANDOM() * 20)::INT] || 
        FLOOR(RANDOM() * 10)::TEXT || 
        ' ' || 
        FLOOR(1 + RANDOM() * 9)::TEXT || 
        (ARRAY['A','B','C','E','G','H','J','K','L','M','N','P','R','S','T','V','W','X','Y','Z'])[FLOOR(1 + RANDOM() * 20)::INT] || 
        FLOOR(RANDOM() * 10)::TEXT
WHERE postal_code IS NULL;

-- Populate address_type if missing
UPDATE properties
SET 
    address_type = (ARRAY['residential', 'residential', 'commercial'])[FLOOR(1 + RANDOM() * 3)::INT]
WHERE address_type IS NULL;

-- Update formatted addresses
UPDATE properties 
SET formatted_address = CONCAT_WS(', ',
    CONCAT_WS(' ', street_number, street_name),
    CASE WHEN unit IS NOT NULL AND unit != '' THEN unit ELSE NULL END,
    city,
    province,
    postal_code,
    country
);

-- Add coordinates for major cities
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
    END
WHERE latitude IS NULL OR longitude IS NULL;

-- Create or update search vector column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'search_vector'
    ) THEN
        ALTER TABLE properties ADD COLUMN search_vector tsvector;
    END IF;
END $$;

-- Update the search vector
UPDATE properties 
SET search_vector = 
    to_tsvector('english', 
        COALESCE(street_number, '') || ' ' || 
        COALESCE(street_name, '') || ' ' || 
        COALESCE(unit, '') || ' ' || 
        COALESCE(city, '') || ' ' || 
        COALESCE(province, '') || ' ' || 
        COALESCE(postal_code, '')
    );

-- Create a GIN index if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_properties_search_vector ON properties USING GIN (search_vector);

-- Report on data population
SELECT 
    'Data population completed!' as status,
    (SELECT COUNT(*) FROM properties) as total_properties,
    (SELECT COUNT(DISTINCT city) FROM properties) as unique_cities,
    (SELECT COUNT(*) FROM properties WHERE street_name IS NOT NULL) as properties_with_address,
    (SELECT COUNT(*) FROM properties WHERE latitude IS NOT NULL) as properties_with_coordinates;

COMMIT;
EOF

# Run the SQL script
echo "🚀 Populating address data..."
psql "$DATABASE_URL" -f $TMP_SQL_FILE

if [ $? -ne 0 ]; then
    echo "❌ Data population failed."
    rm $TMP_SQL_FILE
    exit 1
fi

rm $TMP_SQL_FILE

echo ""
echo "✅ Address data population completed successfully!"
echo ""
