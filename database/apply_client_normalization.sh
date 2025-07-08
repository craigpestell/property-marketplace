#!/bin/bash
# Apply client references normalization migration
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

echo "Starting client references normalization migration..."
echo "This will update all tables to use client_uid for relationships."

# Create a backup first
BACKUP_FILE="database/backups/backup_before_client_normalization_$(date +%Y%m%d_%H%M%S).sql"
mkdir -p database/backups

echo "Creating database backup to $BACKUP_FILE..."
if [ -n "$DB_PASSWORD" ]; then
  PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME > "$BACKUP_FILE"
else
  pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME > "$BACKUP_FILE"
fi

if [ $? -ne 0 ]; then
  echo "Backup failed. Migration aborted for safety."
  exit 1
fi

echo "Backup created successfully. Applying migration..."
if [ -n "$DB_PASSWORD" ]; then
  # Use password from environment
  PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f database/migrations/complete_client_references_normalization.sql
else
  # No password provided, try without it
  psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f database/migrations/complete_client_references_normalization.sql
fi

if [ $? -eq 0 ]; then
  echo "Migration completed successfully!"
  echo "✅ All database tables now support client_uid relationships"
  echo "✅ Email-based columns are preserved for backward compatibility"
  echo "✅ Indexes and foreign keys have been created for optimal performance"
else
  echo "❌ Migration failed. Please check the error messages above."
  echo "The backup is available at $BACKUP_FILE if needed for recovery."
  exit 1
fi
