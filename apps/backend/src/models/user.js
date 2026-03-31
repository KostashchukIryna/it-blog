const db = require("../db");

const findByEmail = async (email) => {
  const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  return rows[0] || null;
};

const findBySlug = async (slug) => {
  const { rows } = await db.query(
    "SELECT id, name, slug, bio, avatar_url, is_admin, created_at FROM users WHERE slug = $1",
    [slug]
  );
  return rows[0] || null;
};

module.exports = { findByEmail, findBySlug };
