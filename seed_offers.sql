-- Seed data for offers system
-- Run this after offers_schema.sql to add sample data

-- Sample offers for testing using actual property data
INSERT INTO offers (
    property_uid, 
    buyer_email, 
    seller_email, 
    offer_amount, 
    message, 
    financing_type, 
    contingencies, 
    closing_date, 
    earnest_money, 
    inspection_period_days,
    status
) VALUES 
-- Offer 1: Pending offer slightly below asking price on Modern Family Home
(
    'PROP-1751157039.932465-1',
    'buyer1@example.com',
    'craigpestell@gmail.com',
    427500, -- 5% below asking ($450,000)
    'We love this property and would like to make a competitive offer. We are pre-approved for financing and can close quickly.',
    'conventional',
    ARRAY['Inspection', 'Financing', 'Appraisal'],
    CURRENT_DATE + INTERVAL '45 days',
    5000.00,
    10,
    'pending'
),

-- Offer 2: Accepted offer at asking price on Downtown Apartment
(
    'PROP-1751157039.932465-2',
    'buyer2@example.com',
    'craigpestell@gmail.com',
    320000, -- Full asking price
    'Full price offer! We are cash buyers and can close in 30 days with no contingencies.',
    'cash',
    ARRAY['Final walk-through'],
    CURRENT_DATE + INTERVAL '30 days',
    10000.00,
    7,
    'accepted'
),

-- Offer 3: Countered offer on Cozy Cottage
(
    'PROP-1751157039.932465-3',
    'buyer3@example.com',
    'craigpestell@gmail.com',
    225000, -- 10% below asking ($250,000)
    'We would like to submit this offer contingent on inspection and financing approval.',
    'fha',
    ARRAY['Inspection', 'Financing', 'Appraisal', 'Sale of current home'],
    CURRENT_DATE + INTERVAL '60 days',
    3000.00,
    14,
    'countered'
),

-- Offer 4: Rejected offer on Luxury Villa (too low)
(
    'PROP-1751157039.932465-4',
    'buyer4@example.com',
    'craigpestell@gmail.com',
    960000, -- 20% below asking ($1,200,000)
    'This is our best offer based on recent comparable sales in the area.',
    'conventional',
    ARRAY['Inspection', 'Financing', 'Appraisal'],
    CURRENT_DATE + INTERVAL '45 days',
    25000.00,
    10,
    'rejected'
),

-- Offer 5: Withdrawn offer on Suburban House
(
    'PROP-1751157039.932465-5',
    'buyer5@example.com',
    'craigpestell@gmail.com',
    372400, -- 2% below asking ($380,000)
    'Competitive offer with quick closing timeline.',
    'va',
    ARRAY['Inspection', 'Financing'],
    CURRENT_DATE + INTERVAL '30 days',
    4000.00,
    7,
    'withdrawn'
),

-- Offer 6: Another pending offer on Modern Family Home (competing offer)
(
    'PROP-1751157039.932465-1',
    'buyer6@example.com',
    'craigpestell@gmail.com',
    445000, -- Just $5k below asking
    'This is a beautiful home perfect for our growing family. We can be flexible on closing date.',
    'conventional',
    ARRAY['Inspection', 'Financing'],
    CURRENT_DATE + INTERVAL '35 days',
    7500.00,
    10,
    'pending'
);

-- Add a counter offer for the countered offer above
INSERT INTO counter_offers (
    original_offer_id,
    counter_amount,
    counter_terms,
    created_by
) VALUES (
    (SELECT offer_id FROM offers WHERE status = 'countered' AND property_uid = 'PROP-1751157039.932465-3'),
    242500, -- Counter at $242,500 (3% above original offer)
    'We appreciate your offer but would like to counter at this price. We can be flexible on the closing date.',
    'craigpestell@gmail.com'
);

-- Add notifications for the offers
INSERT INTO offer_notifications (
    offer_id,
    recipient_email,
    type,
    message
) VALUES 
-- Notifications for pending offers
(
    (SELECT offer_id FROM offers WHERE status = 'pending' AND buyer_email = 'buyer1@example.com'),
    'craigpestell@gmail.com',
    'offer_received',
    'New offer of $427,500 received for "Modern Family Home"'
),
(
    (SELECT offer_id FROM offers WHERE status = 'pending' AND buyer_email = 'buyer6@example.com'),
    'craigpestell@gmail.com',
    'offer_received',
    'New offer of $445,000 received for "Modern Family Home"'
),

-- Notification for accepted offer
(
    (SELECT offer_id FROM offers WHERE status = 'accepted'),
    'buyer2@example.com',
    'offer_accepted',
    'Congratulations! Your offer of $320,000 for "Downtown Apartment" has been accepted!'
),

-- Notification for countered offer
(
    (SELECT offer_id FROM offers WHERE status = 'countered'),
    'buyer3@example.com',
    'offer_countered',
    'Your offer for "Cozy Cottage" has been countered at $242,500. Please review the new terms.'
),

-- Notification for rejected offer
(
    (SELECT offer_id FROM offers WHERE status = 'rejected'),
    'buyer4@example.com',
    'offer_rejected',
    'Unfortunately, your offer of $960,000 for "Luxury Villa" was not accepted at this time.'
),

-- Notification for withdrawn offer
(
    (SELECT offer_id FROM offers WHERE status = 'withdrawn'),
    'craigpestell@gmail.com',
    'offer_withdrawn',
    'The buyer has withdrawn their offer of $372,400 for "Suburban House".'
);

-- Display the seeded data
SELECT 
    o.offer_id,
    o.property_uid,
    o.buyer_email,
    o.seller_email,
    o.offer_amount,
    o.status,
    o.financing_type,
    o.created_at,
    p.title as property_title,
    p.price as listing_price
FROM offers o
JOIN properties p ON o.property_uid = p.property_uid
ORDER BY o.created_at DESC;
