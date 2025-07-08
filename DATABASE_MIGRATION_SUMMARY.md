# Database Migration Summary

This document summarizes all database migrations applied to the Property Marketplace platform.

## Client References Normalization (2025-07-07)

### Purpose

Normalize client references across all tables to use client_uid (UUID) instead of email addresses, while maintaining backward compatibility with legacy code.

### Migration Scripts

- `database/migrations/complete_client_references_normalization.sql`: Main migration script
- `database/migrations/add_client_uid_to_notifications.sql`: Additional script for notifications
- `database/migrations/add_client_uid_to_saved_properties.sql`: Additional script for saved properties
- `database/migrations/add_client_uid_to_offers.sql`: Additional script for offers table
- `database/apply_client_normalization.sh`: Shell script to safely apply the main migration
- `database/apply_notifications_client_uid.sh`: Shell script to apply notifications migration
- `database/apply_saved_properties_client_uid.sh`: Shell script to apply saved properties migration
- `database/apply_offers_client_uid.sh`: Shell script to apply offers migration

### Changes

1. Added `client_uid` column to:
   - `properties`: References the property owner
   - `saved_properties`: References the client who saved the property
   - `offers`: Added `seller_client_uid` and `buyer_client_uid` to reference both parties
   - `showings`: Added `client_uid` (property owner) and `viewer_client_uid` (property viewer)
   - `user_notifications`: Added `client_uid` (recipient) and `related_client_uid` (sender)

2. Created indexes on all new `client_uid` columns for query optimization

3. Added foreign key constraints to maintain referential integrity

4. Populated all new columns based on existing email relationships

### Backward Compatibility

- All email-based columns are preserved for backward compatibility
- API routes have been updated to use client_uid with fallback to email
- New records are created with both client_uid and email for transition period

### Implementation Notes

- Added client_uid columns as UUID type to offers table
- Noted data type mismatch between tables (clients.client_uid is VARCHAR, offers.seller_client_uid is UUID)
- Used type casting in SQL queries to handle comparisons between different types
- Added documented comments instead of foreign keys due to type mismatch
- Added code to verify column existence before using in queries for improved resilience

For detailed information about the data type mismatch and resolution, see [CLIENT_UID_TYPE_MISMATCH.md](docs/CLIENT_UID_TYPE_MISMATCH.md).

### Future Steps

1. Make `client_uid` columns NOT NULL after confirming all data is migrated
2. Remove redundant email-based foreign keys and constraints
3. Update frontend components to use client_uid instead of email
4. Add database triggers to automatically populate client_uid for new records
5. Update queries to exclusively use `client_uid` for relationships

## Address Formatting SQL Function (2025-07-07)

### Purpose

Add a SQL function for consistent address formatting in database queries.

### Migration Scripts

- `database/migrations/add_format_address_function.sql`: Creates the format_address SQL function
- `database/apply_format_address_function.sh`: Shell script to safely apply the function

### Changes

1. Added a `format_address` PostgreSQL function that accepts:
   - street_number
   - street_name
   - unit
   - city
   - province
   - postal_code
   - country

2. The function properly formats addresses with commas and spacing

3. This allows address formatting directly in SQL queries without relying on JavaScript functions

### Usage

```sql
-- Example usage of the format_address function in SQL
SELECT format_address(street_number, street_name, unit, city, province, postal_code, country)
FROM properties;
```

## Contact

For questions about these migrations, contact the database team.
