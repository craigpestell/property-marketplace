#!/bin/bash
set -e

# Get the database configuration from Next.js environment
echo "Reading database configuration..."

# Source the .env file to get environment variables
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
  echo "Database configuration loaded from .env"
else
  echo "No .env file found. Attempting to use existing environment variables."
fi

# Check if variables are set
if [ -z "$PGUSER" ] || [ -z "$PGHOST" ] || [ -z "$PGDATABASE" ] || [ -z "$PGPASSWORD" ]; then
  echo "Error: Database configuration variables not set. Please check your .env file."
  exit 1
fi

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
