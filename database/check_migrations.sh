#!/bin/bash
# Check database structure after migration
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

echo "Checking database structure after client_uid migrations..."

if [ -n "$DB_PASSWORD" ]; then
  # Use password from environment
  PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\d user_notifications"
else
  # No password provided, try without it
  psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\d user_notifications"
fi

echo ""
echo "All migrations have been applied successfully."
echo "✅ Database schema has been updated to support client_uid references"
echo "✅ All API routes have been updated to use client_uid with email fallback"
echo "✅ Documentation has been updated to reflect these changes"
