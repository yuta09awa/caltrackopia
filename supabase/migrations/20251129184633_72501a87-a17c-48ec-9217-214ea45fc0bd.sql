-- Add High-Protein dietary tag for nutrition-focused searches
INSERT INTO dietary_tag_types (name, category, description, icon_name, i18n_key)
VALUES ('High-Protein', 'nutrition', 'Foods with high protein content', 'beef', 'dietary_tag.high_protein')
ON CONFLICT (name) DO NOTHING;