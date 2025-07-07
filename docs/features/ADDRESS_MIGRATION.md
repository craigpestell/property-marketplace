# Address and Client Migration for BC Properties

## Overview

This migration transforms the property marketplace database to support granular Canadian addresses (specifically British Columbia) and cleans up client-property relationships.

## Changes Made

### 1. Client Table Updates

- **Added**: `client_uid` field (UUID) for better relationship management
- **Purpose**: Provides a stable, unique identifier for each client
- **Migration**: All existing clients get auto-generated UUIDs

### 2. Property Address Fields

**Removed**:

- `address` (single text field)
- `user_email` (replaced with proper foreign key)
- `client_email` (redundant field)

**Added**:

- `street_number` - Street number (e.g., "123", "1234A")
- `street_name` - Street name (e.g., "Main Street", "Oak Avenue")
- `unit` - Unit/suite information (e.g., "Unit 401", "Apt 12")
- `city` - City name (defaults to Vancouver)
- `province` - Province (defaults to "British Columbia")
- `postal_code` - Canadian postal code format (e.g., "V6B 1A1")
- `country` - Country (defaults to "Canada")
- `latitude` - Latitude coordinates for mapping
- `longitude` - Longitude coordinates for mapping
- `formatted_address` - Full formatted address for display
- `address_type` - Property type: 'residential', 'commercial', 'mixed'
- `client_uid` - Foreign key reference to clients table

### 3. Relationship Cleanup

- **Before**: Properties linked to clients via `user_email` field
- **After**: Properties linked via proper foreign key `client_uid`
- **Migration**: Existing relationships preserved, orphaned properties assigned random clients

### 4. Test Data Population

Since all existing properties were test data, the migration:

- Generates realistic BC street addresses
- Creates valid Canadian postal codes (V-prefix for Vancouver area)
- Assigns properties to major BC cities (Vancouver, Burnaby, Richmond, etc.)
- Adds approximate latitude/longitude coordinates
- Creates formatted addresses for display

### 5. Search Optimization

- **Added**: `search_location` computed column combining all address fields
- **Added**: Full-text search index for location-based queries
- **Added**: Geographic indexes for map-based searches

## Benefits

### For Development

- **Type Safety**: Structured address data with TypeScript interfaces
- **Validation**: Can validate individual address components
- **Search**: Better filtering by city, postal code, etc.
- **Performance**: Optimized indexes for common queries

### For Users

- **Better Search**: Find properties by specific cities or areas
- **Mapping**: Ready for map integration with lat/lng coordinates
- **Display**: Clean address formatting (e.g., "Vancouver, BC")

### For Future Features

- **Geocoding**: Structured data works better with Google Maps API
- **Distance Search**: "Properties within 10km of downtown Vancouver"
- **Market Analysis**: Group properties by neighborhood/city
- **Delivery Integration**: Structured addresses for delivery services

## Usage Examples

### TypeScript Interface

```typescript
interface Property {
  street_number?: string;
  street_name?: string;
  unit?: string;
  city: string;
  province: string;
  postal_code?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  formatted_address?: string;
  address_type?: 'residential' | 'commercial' | 'mixed';
  client_uid: string;
}
```

### Display Functions

```typescript
// Show "Vancouver, BC" in property cards
formatCityProvince(property);

// Show full address "123 Main St, Unit 4, Vancouver, BC V6B 1A1"
formatAddressForDisplay(property);
```

### SQL Queries

```sql
-- Find all properties in Vancouver
SELECT * FROM properties WHERE city = 'Vancouver';

-- Find properties near downtown Vancouver (within ~5km)
SELECT * FROM properties
WHERE latitude BETWEEN 49.25 AND 49.31
AND longitude BETWEEN -123.15 AND -123.08;

-- Search by address components
SELECT * FROM properties
WHERE MATCH(search_location) AGAINST('Main Street Vancouver');
```

## Migration Execution

### Prerequisites

Before running the migration, ensure you have:

1. PostgreSQL database running
2. Environment variables set (PGDATABASE, PGUSER, PGPASSWORD, PGHOST, PGPORT)
3. Database backup (recommended)

### Running the Migration

#### Step 1: Backup Current Database

```bash
# Create a backup before migration
./database/backup_before_migration.sh
```

#### Step 2: Set Environment Variables

```bash
# Option A: Create .env file from template
cp .env.example .env
# Edit .env with your database credentials

# Option B: Export variables directly
export PGDATABASE=property_marketplace
export PGUSER=your_username
export PGPASSWORD=your_password
export PGHOST=localhost
export PGPORT=5432

# Source .env file if using option A
export $(grep -v '^#' .env | xargs)
```

#### Step 3: Run the Migration

```bash
# Execute the comprehensive migration
./database/run_address_migration.sh
```

#### Step 4: Verify Migration

The migration script will output a summary showing:

- Total properties migrated
- Total clients with UUIDs
- Unique cities populated
- Properties with proper client relationships

### Rollback (if needed)

If the migration fails or needs to be reverted:

```bash
# Find your backup file in database/backups/
psql -h $PGHOST -p $PGPORT -U $PGUSER -d $PGDATABASE < database/backups/backup_before_address_migration_YYYYMMDD_HHMMSS.sql
```

### Migration Files

- `database/migrations/comprehensive_address_client_migration_pg.sql` - Main PostgreSQL migration
- `database/run_address_migration.sh` - Migration execution script
- `database/backup_before_migration.sh` - Backup creation script

## Migration Files

1. `comprehensive_address_client_migration.sql` - Main migration script
2. `addressUtils.ts` - Utility functions for address handling
3. Updated TypeScript interfaces in `types/index.ts`

## Next Steps

1. Run the migration on your database
2. Update API endpoints to use new address fields
3. Update forms to collect structured address data
4. Integrate with geocoding service for lat/lng population
5. Add city-based filtering to property search
