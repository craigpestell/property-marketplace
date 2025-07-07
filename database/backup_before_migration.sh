#!/bin/bash

# Database backup script before migration
# This creates a backup of the current database state

echo "💾 Property Marketplace - Database Backup"
echo "========================================"

# Check if database connection details are provided
if [ -z "$PGDATABASE" ] || [ -z "$PGUSER" ]; then
    echo "⚠️  Please set required environment variables:"
    echo "   PGDATABASE, PGUSER, PGPASSWORD, PGHOST, PGPORT"
    echo ""
    echo "   You can source them from .env file:"
    echo "   export \$(grep -v '^#' .env | xargs)"
    exit 1
fi

# Create backup directory if it doesn't exist
BACKUP_DIR="database/backups"
mkdir -p "$BACKUP_DIR"

# Generate backup filename with timestamp
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
BACKUP_FILE="${BACKUP_DIR}/backup_before_address_migration_${TIMESTAMP}.sql"

echo "📊 Creating database backup..."
echo "Database: $PGDATABASE"
echo "Backup file: $BACKUP_FILE"
echo ""

# Create backup
pg_dump -h "${PGHOST:-localhost}" -p "${PGPORT:-5432}" -U "$PGUSER" -d "$PGDATABASE" > "$BACKUP_FILE"

if [ $? -ne 0 ]; then
    echo "❌ Backup failed"
    exit 1
fi

echo "✅ Backup completed successfully!"
echo "📁 Backup saved to: $BACKUP_FILE"
echo ""
echo "🔄 You can now safely run the migration with:"
echo "   ./database/run_address_migration.sh"
echo ""
echo "🔙 To restore from backup if needed:"
echo "   psql -h \${PGHOST:-localhost} -p \${PGPORT:-5432} -U \$PGUSER -d \$PGDATABASE < $BACKUP_FILE"
