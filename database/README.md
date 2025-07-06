# Database Management

This directory contains all database-related files for the Property Marketplace application.

## Directory Structure

```
database/
├── README.md                    # This file
├── DATABASE_MIGRATION_SUMMARY.md # Migration history and notes
├── setup_database.sh           # Database setup script
├── schema/                      # Database schema files
│   ├── database_schema.sql      # Main database schema
│   ├── offers_schema.sql        # Offers table schema
│   └── notifications_schema.sql # Notifications table schema
├── migrations/                  # Database migration files
│   ├── add_user_email_column.sql
│   ├── migration-add-offer-uid.sql
│   └── populate-offer-uids.sql
└── seeds/                       # Database seed files
    ├── seed_users_and_properties.sql
    └── seed_offers.sql
```

## Quick Start

### 1. Setup Database

Run the setup script to create the database and tables:

```bash
cd database
chmod +x setup_database.sh
./setup_database.sh
```

### 2. Apply Migrations

Apply migrations in chronological order:

```bash
# Add user email column
psql -d property_marketplace -f migrations/add_user_email_column.sql

# Add offer UID system
psql -d property_marketplace -f migrations/migration-add-offer-uid.sql

# Populate existing offers with UIDs
psql -d property_marketplace -f migrations/populate-offer-uids.sql
```

### 3. Seed Data (Optional)

Load sample data for development:

```bash
# Seed users and properties
psql -d property_marketplace -f seeds/seed_users_and_properties.sql

# Seed offers
psql -d property_marketplace -f seeds/seed_offers.sql
```

## Schema Files

### `schema/database_schema.sql`

Contains the main database schema including:

- Users table
- Properties table
- Base structure and relationships

### `schema/offers_schema.sql`

Contains the offers system schema:

- Offers table with UID support
- Indexes for performance
- Constraints and relationships

### `schema/notifications_schema.sql`

Contains the notifications system schema:

- Notifications table
- Real-time notification support
- User notification preferences

## Migration Files

Migrations are applied in chronological order and should never be modified once applied to production.

### `migrations/add_user_email_column.sql`

- **Purpose**: Add email column to users table
- **Applied**: Early development phase
- **Safe to rerun**: Yes (uses IF NOT EXISTS)

### `migrations/migration-add-offer-uid.sql`

- **Purpose**: Add offer_uid columns and indexes to offers and notifications tables
- **Applied**: During UID system migration
- **Safe to rerun**: Yes (uses IF NOT EXISTS)

### `migrations/populate-offer-uids.sql`

- **Purpose**: Populate existing records with generated UIDs
- **Applied**: After UID column creation
- **Safe to rerun**: Yes (only updates NULL values)

## Seed Files

Seed files are for development and testing purposes only. **Never run seed files in production.**

### `seeds/seed_users_and_properties.sql`

Creates sample users and properties for development:

- Test user accounts
- Sample property listings
- Realistic data for testing

### `seeds/seed_offers.sql`

Creates sample offers:

- Offers linked to seeded properties
- Various offer states and types
- Data for testing the offer system

## Database Connection

The application uses PostgreSQL with these default settings:

- **Database**: `property_marketplace`
- **Host**: `localhost`
- **Port**: `5432`
- **User**: Configured via environment variables

## Environment Variables

Required environment variables for database connection:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/property_marketplace"
# or individual components:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=property_marketplace
DB_USER=your_username
DB_PASSWORD=your_password
```

## Best Practices

### For Migrations

1. **Never modify existing migrations** - create new ones instead
2. **Always test migrations** on a copy of production data
3. **Use transactions** where possible for atomic operations
4. **Include rollback procedures** for complex migrations
5. **Document breaking changes** in the migration summary

### For Schema Changes

1. **Update schema files** after applying migrations
2. **Maintain backward compatibility** when possible
3. **Use proper indexes** for query performance
4. **Document relationships** and constraints

### For Seeds

1. **Keep seeds up-to-date** with schema changes
2. **Use realistic data** for testing
3. **Make seeds idempotent** (safe to run multiple times)
4. **Never run seeds in production**

## Troubleshooting

### Common Issues

1. **Permission denied**: Ensure database user has proper permissions
2. **Connection refused**: Check if PostgreSQL is running
3. **Table already exists**: Migrations may have been partially applied
4. **Foreign key violations**: Check data dependencies in seeds

### Useful Commands

```bash
# Check database connection
psql -d property_marketplace -c "SELECT version();"

# List all tables
psql -d property_marketplace -c "\dt"

# Check table structure
psql -d property_marketplace -c "\d table_name"

# Reset database (development only)
dropdb property_marketplace && createdb property_marketplace
```

## Migration History

See `DATABASE_MIGRATION_SUMMARY.md` for detailed migration history and notes.
