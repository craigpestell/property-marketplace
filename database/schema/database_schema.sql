-- Property Marketplace Database Schema
-- This script creates the complete database schema for the property marketplace

-- Create the database (run this separately as a superuser)
-- CREATE DATABASE property_marketplace;

-- Connect to the property_marketplace database before running the rest

-- Create clients table for user management
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- for email/password auth
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create properties table with user_email column
CREATE TABLE IF NOT EXISTS properties (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid(),
    property_uid VARCHAR(50) UNIQUE,
    title VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    details JSONB DEFAULT '{}', -- Store additional property details as JSON
    image_url TEXT,
    client_id INTEGER REFERENCES clients(id), -- Legacy support
    user_email VARCHAR(255), -- New column for direct email reference
    deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_user_email ON properties(user_email);
CREATE INDEX IF NOT EXISTS idx_properties_client_id ON properties(client_id);
CREATE INDEX IF NOT EXISTS idx_properties_property_uid ON properties(property_uid);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at);
CREATE INDEX IF NOT EXISTS idx_properties_deleted ON properties(deleted);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);

-- Add foreign key constraint for user_email (optional)
-- ALTER TABLE properties 
-- ADD CONSTRAINT fk_properties_user_email 
-- FOREIGN KEY (user_email) REFERENCES clients(email);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_clients_updated_at 
    BEFORE UPDATE ON clients 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at 
    BEFORE UPDATE ON properties 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
INSERT INTO clients (name, email) VALUES 
    ('John Doe', 'john@example.com'),
    ('Jane Smith', 'jane@example.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO properties (title, address, price, user_email, details, property_uid) VALUES 
    ('Beautiful Family Home', '123 Oak Street, Springfield, IL', 350000.00, 'john@example.com', 
     '{"bedrooms": 3, "bathrooms": 2, "sqft": 1800, "propertyType": "House"}', 'PROP-' || EXTRACT(EPOCH FROM NOW())::text || '-SAMPLE1'),
    ('Modern Downtown Apartment', '456 Main Ave, Springfield, IL', 185000.00, 'jane@example.com',
     '{"bedrooms": 2, "bathrooms": 1, "sqft": 900, "propertyType": "Apartment"}', 'PROP-' || EXTRACT(EPOCH FROM NOW())::text || '-SAMPLE2'),
    ('Luxury Condo with View', '789 Hill Road, Springfield, IL', 425000.00, 'john@example.com',
     '{"bedrooms": 2, "bathrooms": 2, "sqft": 1200, "propertyType": "Condo"}', 'PROP-' || EXTRACT(EPOCH FROM NOW())::text || '-SAMPLE3')
ON CONFLICT (property_uid) DO NOTHING;
