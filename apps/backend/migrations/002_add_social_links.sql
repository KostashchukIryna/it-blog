-- Migration 002 - Add social media links to users table

ALTER TABLE users ADD COLUMN social_links JSONB DEFAULT '{}';

-- Update the social_links column with some example data for existing users
UPDATE users SET social_links = '{"linkedin": "https://linkedin.com/in/admin", "github": "https://github.com/admin"}' WHERE slug = 'admin';
UPDATE users SET social_links = '{"linkedin": "https://linkedin.com/in/janedoe", "github": "https://github.com/janedoe"}' WHERE slug = 'jane-doe';