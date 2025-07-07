#!/bin/bash

# Migration helper script
echo "🚀 Property Marketplace - Migration Helper"
echo "========================================"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit the .env file with your database credentials."
    exit 1
fi

# Source environment variables from .env file
echo "📂 Loading environment variables from .env file..."
set -a
source .env
set +a

# Validate required variables
if [ -z "$PGDATABASE" ] || [ -z "$PGUSER" ] || [ -z "$PGPASSWORD" ]; then
    echo "❌ Required database variables not found in .env file."
    echo "Please make sure your .env file contains:"
    echo "PGDATABASE, PGUSER, PGPASSWORD, PGHOST, PGPORT"
    exit 1
fi

# Set defaults for host and port if not specified
PGHOST=${PGHOST:-localhost}
PGPORT=${PGPORT:-5432}

# Export DATABASE_URL variable
export DATABASE_URL="postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}"

echo "✅ Environment variables loaded successfully"
echo ""
echo "📊 Database connection details:"
echo "Database: $PGDATABASE"
echo "User: $PGUSER"
echo "Host: ${PGHOST:-localhost}:${PGPORT:-5432}"
echo ""

echo "📋 Migration Process Steps:"
echo "1. Create database backup"
echo "2. Run address migration"
echo ""

# Confirm with user
read -p "Continue with migration? (y/n): " confirm
if [[ $confirm != "y" && $confirm != "Y" ]]; then
    echo "Migration aborted."
    exit 0
fi

echo ""
echo "🔄 Step 1: Creating database backup..."
chmod +x database/backup_before_migration.sh
./database/backup_before_migration.sh

# Check if backup was successful
if [ $? -ne 0 ]; then
    echo "❌ Backup failed. Aborting migration."
    exit 1
fi

echo ""
echo "🔄 Step 2: Running address migration..."
chmod +x database/run_address_migration.sh
./database/run_address_migration.sh

# Check if migration was successful
if [ $? -ne 0 ]; then
    echo "❌ Migration failed."
    echo "You can restore from the backup created in step 1."
    exit 1
fi

echo ""
echo "🔍 Step 3: Verifying migration..."
chmod +x database/verify_migration.sh
./database/verify_migration.sh

# Check if verification was successful
if [ $? -ne 0 ]; then
    echo "❌ Migration verification failed."
    echo "You may need to restore from the backup created in step 1."
    exit 1
fi

echo ""
echo "🎉 Migration completed successfully!"
echo ""
echo "🎯 Next steps:"
echo "1. Test the application with new schema"
echo "2. Verify that all API endpoints work correctly"
echo "3. Check that property forms use the new address fields"
