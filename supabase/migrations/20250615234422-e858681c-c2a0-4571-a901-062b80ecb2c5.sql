
-- Create user_type enum first
CREATE TYPE user_type AS ENUM ('customer', 'restaurant_owner', 'admin');

-- Add user_type column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_type user_type DEFAULT 'customer';

-- Create restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_license TEXT,
  business_email TEXT,
  business_phone TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  cuisine_type TEXT[],
  operating_hours JSONB,
  description TEXT,
  website TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verification_documents TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on owner_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_restaurants_owner_id ON restaurants(owner_id);

-- Create RLS policies for restaurants table
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own restaurant data
CREATE POLICY "Users can read own restaurant data" ON restaurants
  FOR SELECT USING (owner_id = auth.uid());

-- Policy: Users can insert their own restaurant data
CREATE POLICY "Users can insert own restaurant data" ON restaurants
  FOR INSERT WITH CHECK (owner_id = auth.uid());

-- Policy: Users can update their own restaurant data
CREATE POLICY "Users can update own restaurant data" ON restaurants
  FOR UPDATE USING (owner_id = auth.uid());
