-- Migration 003 - Add parent_id to categories for nested categories

ALTER TABLE categories ADD COLUMN parent_id INTEGER REFERENCES categories (id) ON DELETE SET NULL;

-- Drop old unique constraint on slug (if present) and create composite unique index
ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_slug_key;
CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug_parent ON categories (slug, parent_id);

-- Optional: create an index to speed up parent lookups
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories (parent_id);
