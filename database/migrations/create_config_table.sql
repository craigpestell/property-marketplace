-- Create configuration table for app settings
CREATE TABLE IF NOT EXISTS app_config (
    id SERIAL PRIMARY KEY,
    config_key VARCHAR(255) UNIQUE NOT NULL,
    config_value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default configuration for featured properties limit
INSERT INTO app_config (config_key, config_value, description) 
VALUES (
    'featured_properties_limit', 
    '6', 
    'Number of properties to show in the Most Loved Properties section'
) ON CONFLICT (config_key) DO NOTHING;

-- Create an index on config_key for faster lookups
CREATE INDEX IF NOT EXISTS idx_app_config_key ON app_config(config_key);

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_app_config_updated_at 
    BEFORE UPDATE ON app_config 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
