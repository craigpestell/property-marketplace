#!/bin/bash
set -e

# Apply the client_uid to offers migration
# This script adds the seller_client_uid and buyer_client_uid columns to the offers table

echo "Starting to apply offers client_uid migration..."

# Create a backup before proceeding
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="database/backups/backup_before_offers_client_uid_${TIMESTAMP}.sql"

echo "Creating a backup of the current database state..."
mkdir -p database/backups
# Use connection string for better compatibility
DATABASE_URL="postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}"
pg_dump "$DATABASE_URL" > $BACKUP_FILE

echo "Backup created at ${BACKUP_FILE}"

# Apply the migration
echo "Applying migration to add client_uid fields to offers table..."
psql "$DATABASE_URL" -f database/migrations/add_client_uid_to_offers.sql

echo "Migration applied successfully."
echo "Done."
