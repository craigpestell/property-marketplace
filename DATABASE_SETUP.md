# Database Setup Instructions

## Prerequisites

- PostgreSQL installed and running
- Database connection details configured in `.env` file

## Environment Setup

1. Copy the environment example file:

```bash
cp .env.example .env
```

2. Update the `.env` file with your database credentials:

```bash
PGUSER=your_postgres_user
PGHOST=localhost
PGDATABASE=property_marketplace
PGPASSWORD=your_postgres_password
PGPORT=5432
```

## Database Setup

### Option 1: Complete New Setup

If you're setting up the database from scratch:

```bash
# Create the database (as postgres user)
sudo -u postgres createdb property_marketplace

# Run the complete schema setup
psql -U your_postgres_user -d property_marketplace -f database_schema.sql
```

### Option 2: Add user_email Column to Existing Database

If you already have a properties table and just need to add the `user_email` column:

```bash
# Run the migration to add user_email column
psql -U your_postgres_user -d property_marketplace -f add_user_email_column.sql
```

## Database Schema Overview

### Tables Created:

- **clients**: User management (id, name, email, password_hash, timestamps)
- **properties**: Property listings with user_email column for ownership tracking

### Key Features:

- `user_email` column in properties table for direct email-based ownership
- Indexes for performance optimization
- Sample data for testing
- Automatic timestamp updates
- Soft delete support (deleted column)

## Verification

After running the setup, verify the schema:

```bash
psql -U your_postgres_user -d property_marketplace -c "\d properties"
psql -U your_postgres_user -d property_marketplace -c "\d clients"
```

## Environment Variables

Make sure your `.env` file includes all required variables:

```bash
# Database Configuration
PGUSER=your_postgres_user
PGHOST=localhost
PGDATABASE=property_marketplace
PGPASSWORD=your_postgres_password
PGPORT=5432

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key_here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```
