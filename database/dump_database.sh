#!/bin/bash

# Load environment variables from .env file
if [ -f "../.env" ]; then
    # Parse .env file and export variables, skipping comments and special characters
    while IFS='=' read -r key value; do
        # Skip comments and empty lines
        [[ $key =~ ^\# ]] || [[ -z $key ]] && continue
        # Remove quotes from value
        value="${value%\"}"
        value="${value#\"}"
        export "$key=$value"
    done < "../.env"
fi

# Database dump script for Property Marketplace

# Help function
function show_help {
    echo "Usage: ./dump_database.sh [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help      Show this help message"
    echo "  -c, --compress  Create a compressed dump file (.gz)"
    echo ""
    exit 0
}

# Check for help flag
if [ "$1" == "-h" ] || [ "$1" == "--help" ]; then
    show_help
fi

echo "🏠 Property Marketplace Database Dump"
echo "==================================="

# Get current date and time for the filename
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DUMP_FILE="database_dump_${TIMESTAMP}.sql"
COMPRESSED_DUMP_FILE="database_dump_${TIMESTAMP}.gz"

# Check if compression is requested
COMPRESS=false
if [ "$1" == "-c" ] || [ "$1" == "--compress" ]; then
    COMPRESS=true
    echo "�️  Compression enabled"
fi

if [ "$COMPRESS" = true ]; then
    echo "�📊 Dumping and compressing database to $COMPRESSED_DUMP_FILE..."
    # Dump and compress in one step
    PGPASSWORD=$PGPASSWORD pg_dump -h $PGHOST -p $PGPORT -U $PGUSER -d $PGDATABASE -F p | gzip > "$COMPRESSED_DUMP_FILE"
    RESULT=$?
    FINAL_FILE=$COMPRESSED_DUMP_FILE
else
    echo "📊 Dumping database to $DUMP_FILE..."
    # Standard dump
    PGPASSWORD=$PGPASSWORD pg_dump -h $PGHOST -p $PGPORT -U $PGUSER -d $PGDATABASE -F p > "$DUMP_FILE"
    RESULT=$?
    FINAL_FILE=$DUMP_FILE
fi

if [ $RESULT -eq 0 ]; then
    echo "✅ Database dump completed successfully!"
    echo "📁 Dump file location: $(pwd)/$FINAL_FILE"
    echo "📏 File size: $(du -h "$FINAL_FILE" | cut -f1)"
else
    echo "❌ Failed to dump database"
    exit 1
fi
