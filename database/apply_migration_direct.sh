#!/bin/bash
set -e

# Database configuration from .env
PGUSER=craig
PGHOST=localhost
PGDATABASE=real_estate_marketplace
PGPASSWORD=password123
PGPORT=5432

echo "Starting to apply offers client_uid migration..."

# Create a backup before proceeding
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="database/backups"
BACKUP_FILE="${BACKUP_DIR}/backup_before_offers_client_uid_${TIMESTAMP}.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

echo "Creating a backup of the current database state..."
PGPASSWORD=$PGPASSWORD pg_dump -U $PGUSER -h $PGHOST -p $PGPORT $PGDATABASE > $BACKUP_FILE

echo "Backup created at ${BACKUP_FILE}"

# Apply the migration
echo "Applying migration to add client_uid fields to offers table..."
PGPASSWORD=$PGPASSWORD psql -U $PGUSER -h $PGHOST -p $PGPORT -d $PGDATABASE -f database/migrations/add_client_uid_to_offers.sql

echo "Migration applied successfully."
echo "Done."
