# Client UID Data Type Mismatch - Resolution

## Issue

During the migration to add client_uid columns to the offers table, we encountered a data type mismatch between tables:

- **offers**: Uses UUID data type for client_uid columns
- **clients**: Uses VARCHAR data type for client_uid column

This mismatch caused issues with:

1. Foreign key constraints (which could not be created)
2. SQL queries that compared values between tables

## Resolution

### Database Level

1. Added `seller_client_uid` and `buyer_client_uid` columns with UUID data type to the offers table
2. Created indexes for performance optimization
3. Added comments instead of foreign key constraints to document the relationship
4. Used explicit type casting (`::uuid`) during data migration to convert VARCHAR to UUID

### API Level

1. Modified API routes to use explicit text type casting (`::text`) when comparing client_uid values
2. Added verification that the columns exist before using them in queries
3. Maintained backward compatibility by falling back to email-based lookups

## Future Work

To fully normalize the database and resolve the type mismatch, consider:

1. Standardizing the `client_uid` data type across all tables (preferably UUID)
2. Adding proper foreign key constraints once data types match
3. Creating a migration to update all client_uid columns to the same data type

## Testing

All API endpoints have been updated to handle the type mismatch and work correctly:

- GET /api/offers (list offers)
- GET /api/offers/[id] (get offer details)
- POST /api/offers (create new offer)
- PATCH /api/offers/[id] (update offer)

If you encounter any issues, verify that the type casting is being applied correctly in the SQL queries.
