-- Create a function to format addresses in the database
-- This allows us to use address formatting directly in SQL queries

CREATE OR REPLACE FUNCTION format_address(
  street_number VARCHAR,
  street_name VARCHAR,
  unit VARCHAR,
  city VARCHAR,
  province VARCHAR,
  postal_code VARCHAR,
  country VARCHAR
) RETURNS VARCHAR AS $$
DECLARE
  formatted_address VARCHAR;
BEGIN
  -- Build address components
  formatted_address := CONCAT_WS(', ',
    NULLIF(CONCAT_WS(' ', street_number, street_name), ''),
    NULLIF(unit, ''),
    NULLIF(city, ''),
    NULLIF(province, ''),
    NULLIF(postal_code, ''),
    NULLIF(country, '')
  );
  
  RETURN formatted_address;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Test the function
-- SELECT format_address('123', 'Main St', 'Apt 4B', 'New York', 'NY', '10001', 'USA');
