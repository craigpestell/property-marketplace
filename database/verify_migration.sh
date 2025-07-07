#!/bin/bash

# Verify migration script for Property Marketplace
# This script checks if the migration was applied correctly

echo "🔍 Property Marketplace - Migration Verification"
echo "=============================================="
echo ""

# Source environment variables from .env file if not already set
if [ -f ".env" ] && { [ -z "$PGDATABASE" ] || [ -z "$PGUSER" ] || [ -z "$PGPASSWORD" ]; }; then
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

echo "📊 Verifying address and client relationship migration..."
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

# Check for new columns in properties table
echo "🔍 Checking properties table structure..."
PROPERTIES_CHECK=$(psql "$DATABASE_URL" -t -c "SELECT column_name FROM information_schema.columns WHERE table_name = 'properties' AND column_name IN ('street_number', 'street_name', 'unit', 'city', 'province', 'postal_code', 'country', 'client_uid');" | wc -l)

# Check for client_uid foreign key
CLIENT_FK_CHECK=$(psql "$DATABASE_URL" -t -c "SELECT count(*) FROM information_schema.table_constraints WHERE constraint_name = 'fk_properties_client_uid' AND constraint_type = 'FOREIGN KEY';" | xargs)

if [ "$PROPERTIES_CHECK" -lt 7 ] || [ "$CLIENT_FK_CHECK" -lt 1 ]; then
    echo "❌ Migration verification failed. New schema structure not detected."
    exit 1
fi

echo "✅ Schema migration verified successfully!"

# Check data migration
echo ""
echo "🔍 Checking data migration..."
PROPERTY_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT count(*) FROM properties WHERE street_name IS NOT NULL AND city IS NOT NULL;" | xargs)
CLIENT_UID_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT count(*) FROM properties WHERE client_uid IS NOT NULL;" | xargs)

echo "Properties with migrated addresses: $PROPERTY_COUNT"
echo "Properties with client_uid: $CLIENT_UID_COUNT"

if [ "$PROPERTY_COUNT" -lt 1 ] || [ "$CLIENT_UID_COUNT" -lt 1 ]; then
    echo "⚠️  Warning: Data migration may be incomplete."
    echo "    There are no properties with migrated address data or client_uid."
else
    echo "✅ Data migration verified successfully!"
fi

echo ""
echo "🎉 Migration verification complete!"
