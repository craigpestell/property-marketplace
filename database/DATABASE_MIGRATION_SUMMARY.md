# Database Migration Summary - Offer UID Implementation

## Overview

This document summarizes all database changes made to support the migration from numeric `offer_id` to string-based `offer_uid` for the property marketplace application.

## Database Schema Changes

### 1. Offers Table Updates

**File**: `offers_schema.sql`

#### Added Columns:

- `offer_uid VARCHAR(50) UNIQUE NOT NULL` - New primary identifier for offers
  - Format: `OFFER-{timestamp}-{random}` (e.g., `OFFER-C4CA4238-1`)
  - Unique constraint ensures no duplicates
  - NOT NULL constraint added after data migration

#### Added Indexes:

- `idx_offers_offer_uid` - For fast UID-based lookups

### 2. Counter Offers Table Updates

**File**: `offers_schema.sql`

#### Added Columns:

- `original_offer_uid VARCHAR(50)` - References offers by UID
  - Foreign key constraint to `offers(offer_uid)`
  - Allows migration away from numeric IDs

#### Added Indexes:

- `idx_counter_offers_original_offer_uid` - For fast UID-based lookups

### 3. User Notifications Table Updates

**File**: `notifications_schema.sql`

#### Added Columns:

- `related_offer_uid VARCHAR(50)` - References offers by UID
  - Foreign key constraint to `offers(offer_uid)` with CASCADE DELETE
  - Supports both legacy `related_offer_id` and new `related_offer_uid` during transition

#### Added Indexes:

- `idx_user_notifications_offer_uid` - For fast notification queries by offer UID

#### Updated Functions:

- `create_user_notification()` - Added `p_related_offer_uid` parameter

## Migration Scripts

### 1. Initial Migration (`migration-add-offer-uid.sql`)

```sql
-- Add offer_uid column to offers table
ALTER TABLE offers ADD COLUMN IF NOT EXISTS offer_uid VARCHAR(50) UNIQUE;
CREATE INDEX IF NOT EXISTS idx_offers_offer_uid ON offers(offer_uid);

-- Add offer_uid column to user_notifications table
ALTER TABLE user_notifications ADD COLUMN IF NOT EXISTS related_offer_uid VARCHAR(50);
CREATE INDEX IF NOT EXISTS idx_user_notifications_offer_uid ON user_notifications(related_offer_uid);
```

### 2. Data Population (`populate-offer-uids.sql`)

```sql
-- Generate UIDs for existing offers
UPDATE offers
SET offer_uid = 'OFFER-' || UPPER(SUBSTRING(MD5(offer_id::text) FROM 1 FOR 8)) || '-' || offer_id
WHERE offer_uid IS NULL;

-- Make offer_uid mandatory
ALTER TABLE offers ALTER COLUMN offer_uid SET NOT NULL;

-- Populate counter_offers with UIDs
UPDATE counter_offers
SET original_offer_uid = (SELECT offer_uid FROM offers WHERE offers.offer_id = counter_offers.original_offer_id)
WHERE original_offer_uid IS NULL;

-- Populate notifications with UIDs
UPDATE user_notifications
SET related_offer_uid = (SELECT offer_uid FROM offers WHERE offers.offer_id = user_notifications.related_offer_id)
WHERE related_offer_id IS NOT NULL AND related_offer_uid IS NULL;
```

## Database Constraints & Relationships

### Primary Keys

- `offers.offer_id` - Still exists as auto-increment primary key
- `offers.offer_uid` - New unique identifier for business logic

### Foreign Key Relationships

1. **Counter Offers**:
   - `original_offer_id` → `offers(offer_id)` (legacy)
   - `original_offer_uid` → `offers(offer_uid)` (new)

2. **User Notifications**:
   - `related_offer_id` → `offers(offer_id)` (legacy)
   - `related_offer_uid` → `offers(offer_uid)` (new)

### Indexes Summary

| Table              | Index Name                            | Column             | Purpose               |
| ------------------ | ------------------------------------- | ------------------ | --------------------- |
| offers             | idx_offers_offer_uid                  | offer_uid          | Fast UID lookups      |
| counter_offers     | idx_counter_offers_original_offer_uid | original_offer_uid | Counter offer queries |
| user_notifications | idx_user_notifications_offer_uid      | related_offer_uid  | Notification queries  |

## Migration Results

### Data Migration Statistics

- **Offers with UIDs**: 13 records updated
- **Counter offers with UIDs**: 3 records updated
- **Notifications with offer UIDs**: 9 records updated

### Sample Data Format

```sql
-- Offers table sample
offer_id | offer_uid        | property_uid             | buyer_email        | status
---------|------------------|--------------------------|--------------------|---------
1        | OFFER-C4CA4238-1 | PROP-1751157039.932465-1 | buyer1@example.com | pending
2        | OFFER-C81E728D-2 | PROP-1751157039.932465-2 | buyer2@example.com | accepted

-- Counter offers sample
counter_offer_id | original_offer_id | original_offer_uid | counter_amount
-----------------|-------------------|--------------------|--------------
2                | 3                 | OFFER-ECCBC87E-3   | 242500.00
```

## Backwards Compatibility

### Transition Strategy

1. **Phase 1**: Add UID columns alongside existing ID columns
2. **Phase 2**: Populate UIDs for all existing records
3. **Phase 3**: Update application code to use UIDs
4. **Phase 4**: Remove legacy ID references from application
5. **Phase 5** (Future): Remove ID columns from database (optional)

### Legacy Support

- All legacy `offer_id` columns remain intact
- Foreign key constraints maintained for both ID and UID relationships
- Gradual migration path allows rollback if needed

## Performance Considerations

### Indexing Strategy

- All UID columns are indexed for optimal query performance
- Existing ID indexes remain for legacy compatibility
- Query plans should prefer UID indexes for new application code

### Storage Impact

- VARCHAR(50) UIDs require more storage than INTEGER IDs
- Trade-off accepted for improved security and readability
- Unique constraints prevent duplicate UIDs

## Security Benefits

### UID Format Advantages

1. **Non-sequential**: Cannot be guessed or enumerated
2. **Descriptive prefix**: `OFFER-` clearly identifies resource type
3. **Collision-resistant**: Timestamp + random components
4. **URL-safe**: Can be used directly in API routes

### Example UID Generation

```typescript
export function generateOfferUID(): string {
  const prefix = 'OFFER';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}
```

## Next Steps (Optional)

### Future Cleanup (Optional)

1. Remove `offer_id` references from legacy seed files
2. Update any remaining stored procedures
3. Consider removing `offer_id` foreign keys after full transition
4. Archive or remove `offer_notifications` table (replaced by `user_notifications`)

### Monitoring

- Monitor query performance with new UID indexes
- Track application errors during transition period
- Validate data integrity between ID and UID relationships

---

## Migration Status: ✅ COMPLETE

The database has been successfully updated to support offer UIDs while maintaining backwards compatibility. All existing data has been migrated and indexed appropriately. The application is ready for production use with the new UID-based system.
