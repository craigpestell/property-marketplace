#!/bin/bash

# Database seeding script for Property Marketplace
# This script runs all the necessary SQL files to set up the database with test data

echo "🏠 Property Marketplace Database Setup"
echo "======================================"

# Check if database connection details are provided
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  Please set DATABASE_URL environment variable"
    echo "   Example: export DATABASE_URL='postgresql://username:password@localhost:5432/property_marketplace'"
    exit 1
fi

echo "📊 Setting up database schema..."

# Run main schema
echo "1️⃣  Creating main tables..."
psql "$DATABASE_URL" -f database_schema.sql

if [ $? -ne 0 ]; then
    echo "❌ Failed to create main schema"
    exit 1
fi

# Run offers schema
echo "2️⃣  Creating offers tables..."
psql "$DATABASE_URL" -f offers_schema.sql

if [ $? -ne 0 ]; then
    echo "❌ Failed to create offers schema"
    exit 1
fi

# Run user and property seed data
echo "3️⃣  Seeding users and properties..."
psql "$DATABASE_URL" -f seed_users_and_properties.sql

if [ $? -ne 0 ]; then
    echo "❌ Failed to seed users and properties"
    exit 1
fi

echo ""
echo "✅ Database setup completed successfully!"
echo ""
echo "🔑 Test User Accounts (password: password123)"
echo "============================================="
echo "👥 Buyers:"
echo "   • buyer1@example.com (Emily Rodriguez)"
echo "   • buyer2@example.com (Michael Chen)"
echo ""
echo "🏡 Sellers:"
echo "   • seller1@example.com (Sarah Thompson) - 3 properties"
echo "   • seller2@example.com (David Williams) - 3 properties"
echo ""
echo "🏢 Agent:"
echo "   • agent1@example.com (Lisa Martinez) - 2 properties"
echo ""
echo "📈 Summary:"
echo "   • 5 test users created"
echo "   • 8 properties created"
echo "   • 6 sample offers created"
echo "   • 1 counter offer created"
echo "   • Multiple notifications created"
echo ""
echo "🚀 You can now test the offer management system!"
echo "   Visit /offers to see the offers dashboard"
echo "   Visit /listings to browse properties and make offers"
