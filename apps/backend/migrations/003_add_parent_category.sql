-- Migration 003 - Add parent_id to categories for nested categories

ALTER TABLE categories ADD COLUMN parent_id INTEGER REFERENCES categories (id) ON DELETE SET NULL;

-- Drop old unique constraint on slug (if present).
ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_slug_key;

-- Keep root-category slugs unique, while allowing duplicate child slugs under different parents.
CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_root_slug ON categories (slug) WHERE parent_id IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_parent_slug ON categories (parent_id, slug);

-- Optional: create an index to speed up parent lookups
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories (parent_id);
