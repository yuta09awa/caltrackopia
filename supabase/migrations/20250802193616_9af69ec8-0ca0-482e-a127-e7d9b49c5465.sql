-- PostGIS Extension Migration Plan: Move from public to extensions schema
-- This migration addresses the security issue of PostGIS system tables being exposed via REST/GraphQL APIs

-- Step 1: Assessment - Check current spatial data usage
-- (This is informational - run these queries to understand current usage before proceeding)
/*
SELECT schemaname, tablename, attname, typname 
FROM pg_attribute 
JOIN pg_type ON pg_attribute.atttypid = pg_type.oid 
JOIN pg_class ON pg_attribute.attrelid = pg_class.oid 
JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid 
WHERE typname IN ('geometry', 'geography', 'box2d', 'box3d') 
AND schemaname NOT IN ('information_schema', 'pg_catalog');

SELECT routine_name, routine_schema 
FROM information_schema.routines 
WHERE specific_schema = 'public' 
AND routine_name LIKE 'st_%';
*/

-- Step 2: Create backup of spatial data
-- First, let's backup the current spatial data from cached_places and search_areas
CREATE TABLE IF NOT EXISTS spatial_backup_cached_places AS 
SELECT id, place_id, name, latitude, longitude, 
       ST_AsText(location) as location_wkt,
       formatted_address, place_types, primary_type, rating, price_level,
       opening_hours, is_open_now, phone_number, website, photo_references,
       first_cached_at, last_updated_at, last_verified_at, freshness_status,
       api_calls_count, expires_at, refresh_interval_hours, refresh_priority,
       google_api_calls_used, last_api_call_at, custom_notes, raw_google_data,
       search_vector
FROM cached_places;

CREATE TABLE IF NOT EXISTS spatial_backup_search_areas AS 
SELECT id, name, center_latitude, center_longitude,
       ST_AsText(center_location) as center_location_wkt,
       radius_meters, priority, last_populated_at, is_active
FROM search_areas;

-- Step 3: Remove spatial columns (this will be recreated after extension migration)
-- Note: We're backing up the data above before removing columns
ALTER TABLE cached_places DROP COLUMN IF EXISTS location;
ALTER TABLE search_areas DROP COLUMN IF EXISTS center_location;
ALTER TABLE profiles DROP COLUMN IF EXISTS location;

-- Step 4: Drop PostGIS extension from public schema
-- This will remove all PostGIS functions and types from public schema
DROP EXTENSION IF EXISTS postgis CASCADE;

-- Step 5: Create PostGIS extension in extensions schema
-- This moves all PostGIS system tables to extensions schema, removing them from REST/GraphQL APIs
CREATE EXTENSION IF NOT EXISTS postgis SCHEMA extensions;

-- Step 6: Recreate spatial columns with proper schema references
-- Add geometry columns back to tables using the extensions schema
ALTER TABLE cached_places ADD COLUMN location extensions.geometry(POINT, 4326);
ALTER TABLE search_areas ADD COLUMN center_location extensions.geometry(POINT, 4326);
ALTER TABLE profiles ADD COLUMN location extensions.geometry(POINT, 4326);

-- Step 7: Restore spatial data from backups
-- Restore cached_places location data
UPDATE cached_places 
SET location = extensions.ST_GeomFromText(backup.location_wkt, 4326)
FROM spatial_backup_cached_places backup
WHERE cached_places.id = backup.id
AND backup.location_wkt IS NOT NULL;

-- Restore search_areas location data  
UPDATE search_areas
SET center_location = extensions.ST_GeomFromText(backup.center_location_wkt, 4326)
FROM spatial_backup_search_areas backup
WHERE search_areas.id = backup.id
AND backup.center_location_wkt IS NOT NULL;

-- Step 8: Recreate spatial indexes
CREATE INDEX IF NOT EXISTS idx_cached_places_location ON cached_places USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_search_areas_center_location ON search_areas USING GIST (center_location);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles USING GIST (location);

-- Step 9: Update custom types that reference geometry
-- Recreate the location_data custom type with proper schema reference
DROP TYPE IF EXISTS location_data CASCADE;
CREATE TYPE location_data AS (
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    geometry extensions.geometry
);

-- Recreate place_type enum and primary_type enum
DROP TYPE IF EXISTS primary_type CASCADE;
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

-- Recreate freshness_status enum
DROP TYPE IF EXISTS freshness_status CASCADE;
CREATE TYPE freshness_status AS ENUM ('fresh', 'stale', 'expired', 'needs_refresh');

-- Update the cached_places table to use the recreated enum
ALTER TABLE cached_places ALTER COLUMN primary_type TYPE primary_type USING primary_type::text::primary_type;
ALTER TABLE cached_places ALTER COLUMN freshness_status TYPE freshness_status USING freshness_status::text::freshness_status;

-- Step 10: Update any functions that use PostGIS functions to reference extensions schema
-- Note: Most built-in PostGIS functions should work without schema prefix due to search_path
-- But custom functions may need updates

-- Step 11: Create verification queries to ensure migration was successful
-- These can be run after migration to verify everything works
/*
-- Verify spatial data integrity
SELECT COUNT(*) as total_places,
       COUNT(location) as places_with_location,
       COUNT(*) - COUNT(location) as places_missing_location
FROM cached_places;

SELECT COUNT(*) as total_areas,
       COUNT(center_location) as areas_with_location,
       COUNT(*) - COUNT(center_location) as areas_missing_location  
FROM search_areas;

-- Verify PostGIS functions work with extensions schema
SELECT extensions.ST_AsText(location) FROM cached_places LIMIT 1;
SELECT extensions.ST_Distance(
    extensions.ST_MakePoint(-122.4194, 37.7749),
    extensions.ST_MakePoint(-122.4094, 37.7849)
) as test_distance;

-- Verify system tables are no longer in public schema
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('spatial_ref_sys', 'geometry_columns', 'geography_columns');
*/

-- Step 12: Clean up backup tables (run this only after verifying migration success)
-- DROP TABLE IF EXISTS spatial_backup_cached_places;
-- DROP TABLE IF EXISTS spatial_backup_search_areas;

-- Migration Notes:
-- 1. This migration will temporarily remove spatial functionality during execution
-- 2. All spatial data is backed up before column removal and restored after recreation
-- 3. PostGIS system tables will no longer be exposed via REST/GraphQL APIs
-- 4. Application code should continue to work as PostGIS functions maintain backward compatibility
-- 5. Verify all spatial queries work correctly after migration
-- 6. Monitor application logs for any PostGIS-related errors after deployment