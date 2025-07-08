#!/bin/bash
set -e

# Apply the format_address function to the database
# This script adds a SQL function to format addresses consistently

echo "Starting to add format_address function to the database..."

# Create a backup before proceeding
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="database/backups/backup_before_address_function_${TIMESTAMP}.sql"

echo "Creating a backup of the current database state..."
mkdir -p database/backups
pg_dump -U $PGUSER -h $PGHOST $PGDATABASE > $BACKUP_FILE

echo "Backup created at ${BACKUP_FILE}"

# Apply the migration
echo "Adding format_address function to database..."
psql -U $PGUSER -h $PGHOST -d $PGDATABASE -f database/migrations/add_format_address_function.sql

echo "Function added successfully."
echo "Done."
