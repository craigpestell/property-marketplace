-- Add notifications table for better notification management
CREATE TABLE IF NOT EXISTS user_notifications (
    notification_id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('offer_received', 'offer_accepted', 'offer_rejected', 'offer_countered', 'offer_withdrawn', 'offer_expired', 'system', 'reminder')),
    related_offer_id INTEGER REFERENCES offers(offer_id) ON DELETE SET NULL,
    related_property_uid VARCHAR(255),
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent'))
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_email ON user_notifications(user_email);
CREATE INDEX IF NOT EXISTS idx_user_notifications_read_at ON user_notifications(read_at);
CREATE INDEX IF NOT EXISTS idx_user_notifications_type ON user_notifications(type);
CREATE INDEX IF NOT EXISTS idx_user_notifications_created_at ON user_notifications(created_at);

-- Function to create notification
CREATE OR REPLACE FUNCTION create_user_notification(
    p_user_email VARCHAR(255),
    p_title VARCHAR(255),
    p_message TEXT,
    p_type VARCHAR(50),
    p_related_offer_id INTEGER DEFAULT NULL,
    p_related_property_uid VARCHAR(255) DEFAULT NULL,
    p_priority VARCHAR(20) DEFAULT 'normal'
)
RETURNS INTEGER AS $$
DECLARE
    notification_id INTEGER;
BEGIN
    INSERT INTO user_notifications (
        user_email, title, message, type, related_offer_id, related_property_uid, priority
    ) VALUES (
        p_user_email, p_title, p_message, p_type, p_related_offer_id, p_related_property_uid, p_priority
    ) RETURNING user_notifications.notification_id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- Sample notifications for testing
INSERT INTO user_notifications (user_email, title, message, type, priority) VALUES
    ('buyer1@example.com', 'Welcome to the Platform!', 'Welcome to our real estate marketplace. Start browsing properties and making offers!', 'system', 'normal'),
    ('seller1@example.com', 'New Offer Alert', 'You have received a new offer on your Victorian Family Home for $465,000', 'offer_received', 'high'),
    ('buyer2@example.com', 'Offer Accepted!', 'Congratulations! Your offer on the Downtown Loft has been accepted.', 'offer_accepted', 'high')
ON CONFLICT DO NOTHING;
