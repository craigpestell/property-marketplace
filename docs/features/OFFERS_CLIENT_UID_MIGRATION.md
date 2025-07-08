# Client UID in Offers - Migration Guide

This guide explains the process of adding client_uid columns to the offers table to continue the normalization of client references.

## Background

As part of our move away from using email addresses for client relationships, we need to add client_uid columns to the offers table. This allows us to reference clients by their UUID instead of email.

## Migration Steps

1. Create a backup of the current database state
2. Add the seller_client_uid and buyer_client_uid columns to the offers table
3. Create indexes for the new columns
4. Update existing records to populate the client_uid fields
5. Add foreign key constraints

## Running the Migration

```bash
# Make the migration script executable
chmod +x database/apply_offers_client_uid.sh

# Run the migration
./database/apply_offers_client_uid.sh
```

## Code Changes

The API routes have been updated to check for the existence of these columns before using them, providing a smooth transition period where both email and client_uid based lookups are supported.

## Post-Migration Verification

After applying the migration:

1. Verify that the offers table has the seller_client_uid and buyer_client_uid columns
2. Check that new offers are created with both client_uid and email references
3. Verify that existing offers can still be fetched and modified
4. Confirm that notifications are correctly linked to both the seller and buyer

## Reverting (if needed)

If any issues occur, restore from the backup created during the migration process:

```bash
# Restore from backup
psql -U $PGUSER -h $PGHOST $PGDATABASE < database/backups/backup_before_offers_client_uid_*.sql
```
