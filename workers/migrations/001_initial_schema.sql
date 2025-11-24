-- NutriMap Turso Database Schema (SQLite)
-- Production-ready schema for edge replication

-- ============================================
-- RESTAURANTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS restaurants (
  id TEXT PRIMARY KEY,
  place_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  formatted_address TEXT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  primary_type TEXT,
  place_types TEXT, -- JSON array as text: '["restaurant","cafe"]'
  rating REAL,
  price_level INTEGER,
  phone_number TEXT,
  website TEXT,
  photo_references TEXT, -- JSON array as text
  is_open_now INTEGER DEFAULT 0, -- 0 = false, 1 = true
  has_supply_chain_data INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Spatial index for geolocation queries
CREATE INDEX IF NOT EXISTS idx_restaurants_location ON restaurants(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_restaurants_rating ON restaurants(rating DESC);
CREATE INDEX IF NOT EXISTS idx_restaurants_place_id ON restaurants(place_id);

-- Full-text search index (FTS5)
CREATE VIRTUAL TABLE IF NOT EXISTS restaurants_fts USING fts5(
  name, 
  formatted_address, 
  content=restaurants, 
  content_rowid=rowid
);

-- Triggers to keep FTS in sync
CREATE TRIGGER IF NOT EXISTS restaurants_fts_insert AFTER INSERT ON restaurants BEGIN
  INSERT INTO restaurants_fts(rowid, name, formatted_address)
  VALUES (new.rowid, new.name, new.formatted_address);
END;

CREATE TRIGGER IF NOT EXISTS restaurants_fts_update AFTER UPDATE ON restaurants BEGIN
  UPDATE restaurants_fts 
  SET name = new.name, formatted_address = new.formatted_address
  WHERE rowid = old.rowid;
END;

CREATE TRIGGER IF NOT EXISTS restaurants_fts_delete AFTER DELETE ON restaurants BEGIN
  DELETE FROM restaurants_fts WHERE rowid = old.rowid;
END;

-- ============================================
-- SUPPLIERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS suppliers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  supplier_type TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  certifications TEXT, -- JSON array
  specialty_items TEXT, -- JSON array
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);
CREATE INDEX IF NOT EXISTS idx_suppliers_type ON suppliers(supplier_type);

-- ============================================
-- SUPPLIER RELATIONSHIPS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS supplier_relationships (
  id TEXT PRIMARY KEY,
  restaurant_id TEXT NOT NULL,
  supplier_id TEXT NOT NULL,
  relationship_type TEXT,
  start_date TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_supplier_relationships_restaurant ON supplier_relationships(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_supplier_relationships_supplier ON supplier_relationships(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_relationships_active ON supplier_relationships(is_active);

-- ============================================
-- ALLERGEN PROTOCOLS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS allergen_protocols (
  id TEXT PRIMARY KEY,
  restaurant_id TEXT NOT NULL,
  allergen TEXT NOT NULL,
  cross_contamination_risk TEXT, -- 'low', 'medium', 'high'
  protocol_description TEXT,
  last_updated TEXT DEFAULT (datetime('now')),
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_allergen_protocols_restaurant ON allergen_protocols(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_allergen_protocols_allergen ON allergen_protocols(allergen);
CREATE INDEX IF NOT EXISTS idx_allergen_protocols_risk ON allergen_protocols(cross_contamination_risk);

-- ============================================
-- USER DISCLAIMER ACCEPTANCES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_disclaimer_acceptances (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  disclaimer_type TEXT NOT NULL, -- 'allergen_view', 'supply_chain_view'
  disclaimer_version TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  country TEXT, -- CF-IPCountry header (GDPR compliance)
  region TEXT,  -- CF-Region header
  page_url TEXT,
  accepted_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_disclaimer_user ON user_disclaimer_acceptances(user_id);
CREATE INDEX IF NOT EXISTS idx_disclaimer_type ON user_disclaimer_acceptances(disclaimer_type);
CREATE INDEX IF NOT EXISTS idx_disclaimer_timestamp ON user_disclaimer_acceptances(accepted_at);
CREATE INDEX IF NOT EXISTS idx_disclaimer_country ON user_disclaimer_acceptances(country);

-- ============================================
-- VIEWS & AGGREGATES (Optional)
-- ============================================

-- View: Restaurant with supply chain count
CREATE VIEW IF NOT EXISTS restaurants_with_supply_chain AS
SELECT 
  r.*,
  COUNT(DISTINCT sr.supplier_id) as supplier_count,
  COUNT(DISTINCT ap.id) as allergen_protocol_count
FROM restaurants r
LEFT JOIN supplier_relationships sr ON r.id = sr.restaurant_id AND sr.is_active = 1
LEFT JOIN allergen_protocols ap ON r.id = ap.restaurant_id
GROUP BY r.id;
