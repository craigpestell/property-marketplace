#!/bin/bash

# Migration runner for Property Marketplace
# This script applies the comprehensive address and client relationship migration

echo "🔄 Property Marketplace - Address Migration"
echo "=========================================="

# Check if database connection details are provided
if [ -z "$PGDATABASE" ] || [ -z "$PGUSER" ]; then
    echo "⚠️  Please set required environment variables:"
    echo "   PGDATABASE, PGUSER, PGPASSWORD, PGHOST, PGPORT"
    echo ""
    echo "   You can source them from .env file:"
    echo "   export \$(grep -v '^#' .env | xargs)"
    exit 1
fi

# Construct DATABASE_URL if not provided
if [ -z "$DATABASE_URL" ]; then
    DATABASE_URL="postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST:-localhost}:${PGPORT:-5432}/${PGDATABASE}"
fi

echo "📊 Running address and client relationship migration..."
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

# Run the migration
echo "🚀 Applying comprehensive address migration..."
psql "$DATABASE_URL" -f database/migrations/comprehensive_address_client_migration_pg.sql

if [ $? -ne 0 ]; then
    echo "❌ Migration failed"
    exit 1
fi

echo ""
echo "✅ Migration completed successfully!"
echo ""
echo "📊 Summary of changes:"
echo "- Added client_uid to clients and properties tables"
echo "- Migrated from single address field to granular BC address fields"
echo "- Cleaned up user_email/client_email relationships"
echo "- Added proper foreign key constraints"
echo "- Populated test data with realistic BC addresses and coordinates"
echo "- Added search optimization indexes"
echo ""
echo "🎯 Next steps:"
echo "1. Update API endpoints to use new address fields"
echo "2. Update forms to collect granular address data"
echo "3. Test the application with new schema"
