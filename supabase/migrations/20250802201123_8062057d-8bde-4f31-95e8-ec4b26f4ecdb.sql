-- PostGIS Extension Migration Plan (Corrected): Move from public to extensions schema
-- This migration addresses the security issue of PostGIS system tables being exposed via REST/GraphQL APIs

-- Step 1: Create backup of current spatial data
CREATE TABLE IF NOT EXISTS spatial_backup_cached_places AS 
SELECT id, place_id, name, latitude, longitude, 
       CASE WHEN location IS NOT NULL THEN ST_AsText(location) ELSE NULL END as location_wkt,
       formatted_address, place_types, primary_type, rating, price_level,
       opening_hours, is_open_now, phone_number, website, photo_references,
       first_cached_at, last_updated_at, last_verified_at, 
       CASE WHEN freshness_status IS NOT NULL THEN freshness_status::text ELSE 'fresh' END as freshness_status_text,
       api_calls_count, expires_at, refresh_interval_hours, refresh_priority,
       google_api_calls_used, last_api_call_at, custom_notes, raw_google_data,
       search_vector
FROM cached_places;

CREATE TABLE IF NOT EXISTS spatial_backup_search_areas AS 
SELECT id, name, center_latitude, center_longitude,
       CASE WHEN center_location IS NOT NULL THEN ST_AsText(center_location) ELSE NULL END as center_location_wkt,
       radius_meters, priority, last_populated_at, is_active
FROM search_areas;

-- Step 2: Remove spatial columns safely (check if they exist first)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cached_places' AND column_name = 'location') THEN
        ALTER TABLE cached_places DROP COLUMN location;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'search_areas' AND column_name = 'center_location') THEN
        ALTER TABLE search_areas DROP COLUMN center_location;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'location') THEN
        ALTER TABLE profiles DROP COLUMN location;
    END IF;
END $$;

-- Step 3: Drop existing custom types that depend on PostGIS
DROP TYPE IF EXISTS location_data CASCADE;

-- Step 4: Drop PostGIS extension from public schema
DROP EXTENSION IF EXISTS postgis CASCADE;

-- Step 5: Create PostGIS extension in extensions schema
CREATE EXTENSION IF NOT EXISTS postgis SCHEMA extensions;

-- Step 6: Recreate enums first (they don't depend on PostGIS)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'primary_type') THEN
        CREATE TYPE primary_type AS ENUM (
            'restaurant',
            'grocery_store', 
            'supermarket',
            'convenience_store',
            'meal_takeaway',
            'meal_delivery',
            'food',
            'store',
            'bakery',
            'cafe',
            'bar',
            'night_club',
            'shopping_mall',
            'farmers_market',
            'health_food_store',
            'organic_store'
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'freshness_status') THEN
        CREATE TYPE freshness_status AS ENUM ('fresh', 'stale', 'expired', 'needs_refresh');
    END IF;
END $$;

-- Step 7: Add missing columns back with proper types
DO $$
BEGIN
    -- Add freshness_status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cached_places' AND column_name = 'freshness_status') THEN
        ALTER TABLE cached_places ADD COLUMN freshness_status freshness_status DEFAULT 'fresh'::freshness_status;
    END IF;
    
    -- Ensure primary_type column has correct type
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cached_places' AND column_name = 'primary_type') THEN
        ALTER TABLE cached_places ALTER COLUMN primary_type TYPE primary_type USING primary_type::text::primary_type;
    END IF;
END $$;

-- Step 8: Recreate spatial columns with extensions schema
ALTER TABLE cached_places ADD COLUMN location extensions.geometry(POINT, 4326);
ALTER TABLE search_areas ADD COLUMN center_location extensions.geometry(POINT, 4326);
ALTER TABLE profiles ADD COLUMN location extensions.geometry(POINT, 4326);

-- Step 9: Restore spatial data from backups
UPDATE cached_places 
SET location = extensions.ST_GeomFromText(backup.location_wkt, 4326),
    freshness_status = backup.freshness_status_text::freshness_status
FROM spatial_backup_cached_places backup
WHERE cached_places.id = backup.id
AND backup.location_wkt IS NOT NULL;

UPDATE search_areas
SET center_location = extensions.ST_GeomFromText(backup.center_location_wkt, 4326)
FROM spatial_backup_search_areas backup
WHERE search_areas.id = backup.id
AND backup.center_location_wkt IS NOT NULL;

-- Step 10: Recreate spatial indexes
CREATE INDEX IF NOT EXISTS idx_cached_places_location ON cached_places USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_search_areas_center_location ON search_areas USING GIST (center_location);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles USING GIST (location);

-- Step 11: Recreate location_data type with extensions schema reference
CREATE TYPE location_data AS (
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    geometry extensions.geometry
);

-- Step 12: Clean up backup tables
DROP TABLE IF EXISTS spatial_backup_cached_places;
DROP TABLE IF EXISTS spatial_backup_search_areas;

-- Verification: Check that PostGIS system tables are no longer in public schema
-- Run this after migration to verify success:
/*
SELECT table_schema, table_name 
FROM information_schema.tables 
WHERE table_name IN ('spatial_ref_sys', 'geometry_columns', 'geography_columns')
ORDER BY table_schema, table_name;
*/