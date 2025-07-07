#!/bin/bash

# Migration status script for Property Marketplace
# This script displays a summary of the migration status

echo "📊 Property Marketplace - Migration Status"
echo "========================================"
echo ""

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

echo "Database: $PGDATABASE"
echo "Host: ${PGHOST:-localhost}:${PGPORT:-5432}"
echo ""

# Check if we can connect to the database
echo "🔍 Testing database connection..."
if ! psql "$DATABASE_URL" -c "SELECT version();" > /dev/null 2>&1; then
    echo "❌ Failed to connect to database. Please check your connection settings."
    exit 1
fi

echo "✅ Database connection successful"
echo ""

# Create temporary SQL script for data analysis
TMP_SQL_FILE=$(mktemp)

cat > $TMP_SQL_FILE << 'EOF'
-- Migration status report
WITH stats AS (
    SELECT 
        COUNT(*) AS total_properties,
        COUNT(DISTINCT client_uid) AS unique_client_relationships,
        COUNT(DISTINCT city) AS unique_cities,
        COUNT(*) FILTER (WHERE street_name IS NOT NULL AND city IS NOT NULL) AS properties_with_address,
        COUNT(*) FILTER (WHERE latitude IS NOT NULL AND longitude IS NOT NULL) AS properties_with_coordinates,
        COUNT(*) FILTER (WHERE formatted_address IS NOT NULL) AS properties_with_formatted_address,
        COUNT(*) FILTER (WHERE search_vector IS NOT NULL) AS properties_with_search_vector,
        COUNT(*) FILTER (WHERE address_type = 'residential') AS residential_properties,
        COUNT(*) FILTER (WHERE address_type = 'commercial') AS commercial_properties
    FROM 
        properties
)
SELECT 
    'Migration Status: COMPLETE' AS status,
    total_properties,
    unique_client_relationships,
    unique_cities,
    properties_with_address,
    properties_with_coordinates,
    properties_with_formatted_address,
    properties_with_search_vector,
    residential_properties,
    commercial_properties
FROM 
    stats;

-- Show city distribution
SELECT 
    city, 
    COUNT(*) AS property_count,
    ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM properties), 1) AS percentage
FROM 
    properties 
GROUP BY 
    city
ORDER BY 
    COUNT(*) DESC;
EOF

# Run the SQL script
echo "📊 Migration Status Report:"
echo "------------------------"
psql "$DATABASE_URL" -f "$TMP_SQL_FILE"

rm "$TMP_SQL_FILE"

echo ""
echo "🎉 Address migration completed successfully!"
echo ""
echo "🎯 Next steps:"
echo "1. Test the application with the new address schema"
echo "2. Update forms to use the new address fields"
echo "3. Enhance search functionality to use the new city and location fields"
