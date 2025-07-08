# Client References Normalization

## Overview

This document outlines the normalization of client references in the Property Marketplace database, moving from email-based relationships to using `client_uid` as the primary key for relationships.

## Motivation

Using email addresses as foreign keys has several drawbacks:

- Emails can change over time
- They're lengthy strings that consume more storage
- They expose personally identifiable information (PII) in more places
- They can cause cascading updates if a user changes their email

Using `client_uid` as a UUID-based identifier provides:

- Immutable references that never need to change
- More efficient indexing and storage
- Better data privacy
- Simpler relationship management

## Migration Strategy

We've adopted a gradual migration strategy to ensure backward compatibility:

1. Add `client_uid` columns to all relationship tables
2. Populate these columns based on existing email relationships
3. Update application code to use `client_uid` for new records
4. Maintain backward compatibility with email-based lookups
5. Eventually make `client_uid` NOT NULL and remove email-based foreign keys

## Affected Tables

The following tables have been updated with `client_uid` columns:

- `saved_properties`: Added `client_uid` to reference the client who saved the property
- `user_notifications`: Added `client_uid` to reference the client receiving the notification, and `related_client_uid` to track the sender
- `offers`: Added `seller_client_uid` (seller) and `buyer_client_uid` (buyer) to reference both parties
- `showings`: Added `client_uid` (property owner) and `viewer_client_uid` (property viewer)

## Code Changes

API routes have been updated to:

1. Use `client_uid` for lookups when available
2. Fall back to email-based lookups for backward compatibility
3. Store both `client_uid` and email in new records for transition period

## Future Steps

1. Make `client_uid` columns NOT NULL after confirming all data is migrated
2. Remove redundant email-based foreign keys and constraints
3. Update all frontend components to use client_uid instead of email for lookups
4. Add database triggers to automatically populate client_uid when new records are created with email
5. Update queries to exclusively use `client_uid` for relationships

## Migration Scripts

Four migration scripts are provided:

1. `complete_client_references_normalization.sql`: Main migration script that adds client_uid to most tables
2. `add_client_uid_to_notifications.sql`: Additional script to add client_uid to the user_notifications table
3. `add_client_uid_to_saved_properties.sql`: Additional script to add client_uid to the saved_properties table
4. `apply_client_normalization.sh`, `apply_notifications_client_uid.sh`, and `apply_saved_properties_client_uid.sh`: Shell scripts to safely apply the migrations with proper backups

- `normalize_client_references.sql` - Initial migration adding client_uid to saved_properties and user_notifications
- `complete_client_references_normalization.sql` - Completes the normalization for all remaining tables

To run the migration:

1. Make sure your database is backed up first
2. Execute the application script:

```bash
./database/apply_client_normalization.sh
```

This script will:

1. Create a backup of your database before making changes
2. Apply the migration to add and populate client_uid columns
3. Create necessary indexes and foreign key constraints
4. Maintain backward compatibility with email-based columns

### Testing After Migration

After running the migration:

1. Verify that all existing data is still accessible
2. Test creating new records to ensure they have proper client_uid values
3. Check that lookups work correctly with both email and client_uid

### Rollback Process

If needed, you can rollback by restoring the backup created during migration:

```bash
psql -h $PGHOST -p $PGPORT -U $PGUSER -d $PGDATABASE < database/backups/backup_before_client_normalization_[timestamp].sql
```
