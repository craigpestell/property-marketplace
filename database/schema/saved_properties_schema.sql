-- Create saved_properties table for user favorites
CREATE TABLE IF NOT EXISTS saved_properties (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    property_uid VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure a user can't save the same property twice
    UNIQUE(user_email, property_uid),
    
    -- Foreign key to properties table
    FOREIGN KEY (property_uid) REFERENCES properties(property_uid) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_saved_properties_user_email ON saved_properties(user_email);
CREATE INDEX IF NOT EXISTS idx_saved_properties_property_uid ON saved_properties(property_uid);
CREATE INDEX IF NOT EXISTS idx_saved_properties_user_property ON saved_properties(user_email, property_uid);

-- Add some comments for documentation
COMMENT ON TABLE saved_properties IS 'Stores user saved/favorite properties';
COMMENT ON COLUMN saved_properties.user_email IS 'Email of the user who saved the property';
COMMENT ON COLUMN saved_properties.property_uid IS 'UID of the saved property';
COMMENT ON COLUMN saved_properties.created_at IS 'When the property was saved';
