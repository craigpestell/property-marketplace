-- Comprehensive seed data for users and properties
-- Run this after database_schema.sql and offers_schema.sql

-- Clear existing test data (optional - comment out in production)
DELETE FROM offer_notifications WHERE offer_id IN (SELECT offer_id FROM offers WHERE property_uid LIKE 'SEED-%');
DELETE FROM counter_offers WHERE original_offer_id IN (SELECT offer_id FROM offers WHERE property_uid LIKE 'SEED-%');
DELETE FROM offers WHERE property_uid LIKE 'SEED-%';
DELETE FROM properties WHERE property_uid LIKE 'SEED-%';
DELETE FROM clients WHERE email IN ('buyer1@example.com', 'buyer2@example.com', 'seller1@example.com', 'seller2@example.com', 'agent1@example.com');

-- Insert test users with bcrypt hashed passwords (password123 for all)
INSERT INTO clients (name, email, password_hash) VALUES 
    ('Emily Rodriguez', 'buyer1@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewxlgBT8tGbP/r0a'),
    ('Michael Chen', 'buyer2@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewxlgBT8tGbP/r0a'),
    ('Sarah Thompson', 'seller1@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewxlgBT8tGbP/r0a'),
    ('David Williams', 'seller2@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewxlgBT8tGbP/r0a'),
    ('Lisa Martinez', 'agent1@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewxlgBT8tGbP/r0a')
ON CONFLICT (email) DO NOTHING;

-- Insert realistic properties with detailed information
INSERT INTO properties (title, address, price, user_email, details, property_uid, image_url) VALUES 

-- Properties owned by Sarah Thompson (seller1@example.com)
('Stunning Victorian Family Home', '1847 Maple Avenue, Springfield, IL 62704', 485000.00, 'seller1@example.com',
 '{"bedrooms": 4, "bathrooms": 3, "sqft": 2400, "propertyType": "House", "yearBuilt": 1895, "lotSize": "0.25 acres", "features": ["Hardwood floors", "Original crown molding", "Updated kitchen", "Wrap-around porch", "Detached garage"], "description": "Beautifully restored Victorian home with modern amenities while preserving historic charm."}', 
 'SEED-PROP-001', 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'),

('Modern Downtown Loft', '312 State Street Unit 4B, Springfield, IL 62701', 275000.00, 'seller1@example.com',
 '{"bedrooms": 2, "bathrooms": 2, "sqft": 1100, "propertyType": "Condo", "yearBuilt": 2018, "features": ["Open floor plan", "Floor-to-ceiling windows", "Stainless steel appliances", "In-unit laundry", "Rooftop terrace access"], "description": "Contemporary loft living in the heart of downtown with stunning city views."}',
 'SEED-PROP-002', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'),

('Charming Cottage Retreat', '856 Oak Hill Drive, Springfield, IL 62702', 195000.00, 'seller1@example.com',
 '{"bedrooms": 2, "bathrooms": 1, "sqft": 900, "propertyType": "House", "yearBuilt": 1952, "lotSize": "0.15 acres", "features": ["Cozy fireplace", "Updated bathroom", "Large backyard", "Garden shed", "Covered patio"], "description": "Perfect starter home or investment property with character and potential."}',
 'SEED-PROP-003', 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800'),

-- Properties owned by David Williams (seller2@example.com)
('Luxury Executive Estate', '2905 Country Club Lane, Springfield, IL 62712', 850000.00, 'seller2@example.com',
 '{"bedrooms": 5, "bathrooms": 4, "sqft": 4200, "propertyType": "House", "yearBuilt": 2015, "lotSize": "1.2 acres", "features": ["Gourmet kitchen", "Master suite with sitting area", "Home office", "3-car garage", "Swimming pool", "Wine cellar"], "description": "Exceptional custom-built home in prestigious Country Club neighborhood."}',
 'SEED-PROP-004', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'),

('Cozy Suburban Ranch', '1523 Elmwood Court, Springfield, IL 62703', 320000.00, 'seller2@example.com',
 '{"bedrooms": 3, "bathrooms": 2, "sqft": 1650, "propertyType": "House", "yearBuilt": 1978, "lotSize": "0.3 acres", "features": ["Split-level design", "Finished basement", "Screened porch", "2-car garage", "Mature landscaping"], "description": "Well-maintained family home in quiet neighborhood with excellent schools."}',
 'SEED-PROP-005', 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'),

('Urban Townhouse', '487 Lincoln Park Row, Springfield, IL 62701', 395000.00, 'seller2@example.com',
 '{"bedrooms": 3, "bathrooms": 2, "sqft": 1800, "propertyType": "Townhouse", "yearBuilt": 2010, "features": ["Two-story layout", "Private patio", "Attached garage", "Modern finishes", "Walking distance to park"], "description": "Contemporary townhouse offering low-maintenance living near downtown amenities."}',
 'SEED-PROP-006', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'),

-- Properties owned by Lisa Martinez (agent1@example.com)
('Investment Duplex', '742 Jefferson Street, Springfield, IL 62702', 225000.00, 'agent1@example.com',
 '{"bedrooms": 4, "bathrooms": 2, "sqft": 1600, "propertyType": "Multi-family", "yearBuilt": 1965, "units": 2, "features": ["Separate entrances", "Updated electrical", "Off-street parking", "Good rental history"], "description": "Excellent investment opportunity with stable rental income from both units."}',
 'SEED-PROP-007', 'https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=800'),

('Renovated Bungalow', '1089 Birch Street, Springfield, IL 62704', 165000.00, 'agent1@example.com',
 '{"bedrooms": 2, "bathrooms": 1, "sqft": 1000, "propertyType": "House", "yearBuilt": 1940, "lotSize": "0.12 acres", "features": ["Recently renovated", "New roof", "Updated kitchen", "Hardwood floors", "Large front porch"], "description": "Completely renovated bungalow ready for immediate occupancy."}',
 'SEED-PROP-008', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800')

ON CONFLICT (property_uid) DO NOTHING;

-- Insert sample offers to demonstrate the system
INSERT INTO offers (property_uid, buyer_email, seller_email, offer_amount, status, message, financing_type, contingencies, closing_date, earnest_money, inspection_period_days) VALUES 

-- Active offers that buyers can see
('SEED-PROP-001', 'buyer1@example.com', 'seller1@example.com', 465000.00, 'pending', 'We absolutely love this Victorian home! Our family has been looking for a house with this much character and charm. We''re pre-approved and ready to close quickly.', 'conventional', 
 ARRAY['inspection', 'financing', 'appraisal'], '2025-09-15', 15000.00, 14),

('SEED-PROP-004', 'buyer2@example.com', 'seller2@example.com', 825000.00, 'pending', 'This executive estate is exactly what we''ve been searching for. We can offer a quick closing and have excellent credit.', 'conventional',
 ARRAY['inspection', 'appraisal'], '2025-08-30', 25000.00, 10),

('SEED-PROP-003', 'buyer1@example.com', 'seller1@example.com', 185000.00, 'countered', 'This cottage would be perfect for our first home. We''re excited about the potential and the neighborhood.', 'fha',
 ARRAY['inspection', 'financing', 'appraisal'], '2025-09-01', 3000.00, 14),

-- Completed/historical offers
('SEED-PROP-002', 'buyer2@example.com', 'seller1@example.com', 270000.00, 'accepted', 'We love the downtown location and modern amenities. Looking forward to city living!', 'cash',
 ARRAY['inspection'], '2025-08-15', 8000.00, 7),

('SEED-PROP-005', 'buyer1@example.com', 'seller2@example.com', 295000.00, 'rejected', 'This ranch home fits our budget and family needs perfectly. Hope we can work something out.', 'conventional',
 ARRAY['inspection', 'financing', 'appraisal'], '2025-09-10', 5000.00, 14),

('SEED-PROP-006', 'buyer2@example.com', 'seller2@example.com', 380000.00, 'withdrawn', 'We found this townhouse very appealing, but circumstances have changed.', 'conventional',
 ARRAY['inspection', 'financing'], '2025-08-25', 8000.00, 10)

ON CONFLICT DO NOTHING;

-- Insert counter offer for the cottage
INSERT INTO counter_offers (original_offer_id, counter_amount, counter_terms, closing_date, created_by) 
SELECT offer_id, 198000.00, 'We appreciate your interest! We can accept $198,000 with a slightly later closing date to accommodate our moving timeline.', '2025-09-15', 'seller1@example.com'
FROM offers 
WHERE property_uid = 'SEED-PROP-003' AND buyer_email = 'buyer1@example.com' AND status = 'countered'
LIMIT 1;

-- Insert notifications for the offers
INSERT INTO offer_notifications (offer_id, recipient_email, type, message) 
SELECT o.offer_id, o.seller_email, 'offer_received', 
       'New offer received for ' || p.title || ' at $' || o.offer_amount
FROM offers o
JOIN properties p ON p.property_uid = o.property_uid
WHERE o.property_uid LIKE 'SEED-%' AND o.status = 'pending'

UNION ALL

SELECT o.offer_id, o.buyer_email, 'offer_accepted',
       'Your offer for ' || p.title || ' has been accepted!'
FROM offers o
JOIN properties p ON p.property_uid = o.property_uid
WHERE o.property_uid LIKE 'SEED-%' AND o.status = 'accepted'

UNION ALL

SELECT o.offer_id, o.buyer_email, 'offer_rejected',
       'Your offer for ' || p.title || ' has been declined.'
FROM offers o
JOIN properties p ON p.property_uid = o.property_uid
WHERE o.property_uid LIKE 'SEED-%' AND o.status = 'rejected'

UNION ALL

SELECT o.offer_id, o.buyer_email, 'offer_countered',
       'The seller has made a counter offer for ' || p.title
FROM offers o
JOIN properties p ON p.property_uid = o.property_uid
WHERE o.property_uid LIKE 'SEED-%' AND o.status = 'countered';

-- Display summary of what was created
SELECT 'Users Created' as category, COUNT(*) as count FROM clients WHERE email LIKE '%@example.com'
UNION ALL
SELECT 'Properties Created', COUNT(*) FROM properties WHERE property_uid LIKE 'SEED-%'
UNION ALL
SELECT 'Offers Created', COUNT(*) FROM offers WHERE property_uid LIKE 'SEED-%'
UNION ALL
SELECT 'Counter Offers Created', COUNT(*) FROM counter_offers WHERE original_offer_id IN (SELECT offer_id FROM offers WHERE property_uid LIKE 'SEED-%')
UNION ALL
SELECT 'Notifications Created', COUNT(*) FROM offer_notifications WHERE offer_id IN (SELECT offer_id FROM offers WHERE property_uid LIKE 'SEED-%');

-- Display test user credentials
SELECT 'Test User Credentials' as info, 'All passwords are: password123' as details
UNION ALL
SELECT 'Buyers', 'buyer1@example.com (Emily Rodriguez), buyer2@example.com (Michael Chen)'
UNION ALL
SELECT 'Sellers', 'seller1@example.com (Sarah Thompson), seller2@example.com (David Williams)'
UNION ALL
SELECT 'Agent', 'agent1@example.com (Lisa Martinez)';
