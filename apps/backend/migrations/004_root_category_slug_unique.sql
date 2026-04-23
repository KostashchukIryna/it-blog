-- Migration 004 - Ensure root-category slug uniqueness for nested categories

ALTER TABLE categories
  DROP CONSTRAINT IF EXISTS categories_slug_key;

CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_root_slug
  ON categories (slug)
  WHERE parent_id IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_parent_slug
  ON categories (parent_id, slug);
