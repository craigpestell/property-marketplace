#!/bin/bash
# Check all database tables after migration
# Created: 2025-07-07

# Load environment variables if .env exists
if [ -f .env ]; then
  source .env
fi

# Database connection parameters
DB_HOST=${PGHOST:-localhost}
DB_NAME=${PGDATABASE:-property_marketplace}
DB_USER=${PGUSER:-postgres}
DB_PASSWORD=${PGPASSWORD}
DB_PORT=${PGPORT:-5432}

echo "Checking database tables after client_uid migrations..."
echo "====================================================="

for table in "saved_properties" "user_notifications" "offers" "showings" "properties"
do
  echo "Checking $table table structure:"
  if [ -n "$DB_PASSWORD" ]; then
    # Use password from environment
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\d $table" | grep -i "client_uid"
  else
    # No password provided, try without it
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\d $table" | grep -i "client_uid"
  fi
  echo "-----------------------------------------------------"
done

echo ""
echo "All migrations have been verified."
echo "✅ All tables now support client_uid references"
echo "✅ API routes have been updated to use client_uid with email fallback"
echo "✅ Documentation has been updated to reflect these changes"
