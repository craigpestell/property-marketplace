#!/bin/bash

# Database connection test script
echo "🔍 Property Marketplace - Database Connection Test"
echo "=============================================="

# If .env file exists, source it
if [ -f ".env" ]; then
    echo "Loading environment variables from .env file..."
    set -a
    source .env
    set +a
fi

# Display current settings
echo "Current database settings:"
echo "PGDATABASE: ${PGDATABASE:-not set}"
echo "PGUSER: ${PGUSER:-not set}"
echo "PGHOST: ${PGHOST:-not set}"
echo "PGPORT: ${PGPORT:-not set}"
echo "PGPASSWORD: ${PGPASSWORD:+******}"
echo ""

# Try connection with current settings
echo "Testing connection with current settings..."
if psql -c "SELECT version();" > /dev/null 2>&1; then
    echo "✅ Connection successful!"
    DB_NAME=$(psql -t -c "SELECT current_database();" | xargs)
    echo "Connected to database: $DB_NAME"
    exit 0
else
    echo "❌ Connection failed with current settings"
fi

# Try listing databases to help troubleshoot
echo ""
echo "Attempting to list available databases..."
PGDATABASE=postgres psql -l 2>/dev/null || echo "❌ Cannot list databases"

exit 1
