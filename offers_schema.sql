-- Offers Management Schema
-- Run this after the main database_schema.sql

CREATE TABLE IF NOT EXISTS offers (
    offer_id SERIAL PRIMARY KEY,
    offer_uid VARCHAR(50) UNIQUE NOT NULL,
    property_uid VARCHAR(255) NOT NULL,
    buyer_email VARCHAR(255) NOT NULL,
    seller_email VARCHAR(255) NOT NULL,
    offer_amount DECIMAL(12, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'countered', 'withdrawn', 'expired')),
    message TEXT,
    financing_type VARCHAR(50) DEFAULT 'conventional' CHECK (financing_type IN ('cash', 'conventional', 'fha', 'va', 'other')),
    contingencies TEXT[],
    closing_date DATE,
    earnest_money DECIMAL(12, 2),
    inspection_period_days INTEGER DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '72 hours')
);

-- Foreign key constraint (if properties table exists)
-- ALTER TABLE offers ADD CONSTRAINT fk_offers_property_uid FOREIGN KEY (property_uid) REFERENCES properties(property_uid) ON DELETE CASCADE;

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_offers_offer_uid ON offers(offer_uid);
CREATE INDEX IF NOT EXISTS idx_offers_property_uid ON offers(property_uid);
CREATE INDEX IF NOT EXISTS idx_offers_buyer_email ON offers(buyer_email);
CREATE INDEX IF NOT EXISTS idx_offers_seller_email ON offers(seller_email);
CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);
CREATE INDEX IF NOT EXISTS idx_offers_created_at ON offers(created_at);

-- Counter offers table (for offer negotiations)
CREATE TABLE IF NOT EXISTS counter_offers (
    counter_offer_id SERIAL PRIMARY KEY,
    original_offer_id INTEGER NOT NULL,
    original_offer_uid VARCHAR(50),
    counter_amount DECIMAL(12, 2) NOT NULL,
    counter_terms TEXT,
    closing_date DATE,
    created_by VARCHAR(255) NOT NULL, -- email of person making counter
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (original_offer_id) REFERENCES offers(offer_id) ON DELETE CASCADE,
    FOREIGN KEY (original_offer_uid) REFERENCES offers(offer_uid) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_counter_offers_original_offer ON counter_offers(original_offer_id);
CREATE INDEX IF NOT EXISTS idx_counter_offers_original_offer_uid ON counter_offers(original_offer_uid);

-- Offer notifications table
CREATE TABLE IF NOT EXISTS offer_notifications (
    notification_id SERIAL PRIMARY KEY,
    offer_id INTEGER NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('offer_received', 'offer_accepted', 'offer_rejected', 'offer_countered', 'offer_withdrawn', 'offer_expired')),
    message TEXT NOT NULL,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (offer_id) REFERENCES offers(offer_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON offer_notifications(recipient_email);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON offer_notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON offer_notifications(read_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_offers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_offers_updated_at
    BEFORE UPDATE ON offers
    FOR EACH ROW
    EXECUTE FUNCTION update_offers_updated_at();

-- Sample data (optional - remove in production)
-- INSERT INTO offers (property_uid, buyer_email, seller_email, offer_amount, message, financing_type, closing_date, earnest_money)
-- VALUES 
--     ('sample-property-uid', 'buyer@example.com', 'seller@example.com', 450000.00, 'We love this property and would like to make an offer!', 'conventional', '2025-09-01', 5000.00);
