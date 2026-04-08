const db = require("../db");

const findByEmail = async (email) => {
  const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  return rows[0] || null;
};

const findBySlug = async (slug) => {
  const { rows } = await db.query(
    `SELECT u.id, u.name, u.slug, u.bio, u.avatar_url, u.is_admin, u.created_at,
            u.social_links,
            COUNT(a.id) FILTER (WHERE a.status = 'published') as article_count
     FROM users u
     LEFT JOIN articles a ON a.author_id = u.id
     WHERE u.slug = $1
     GROUP BY u.id`,
    [slug]
  );
  const user = rows[0] || null;
  if (user) {
    user.article_count = Number(user.article_count);
  }
  return user;
};

const findAll = async () => {
  const { rows } = await db.query(
    `SELECT u.id, u.name, u.slug, u.bio, u.avatar_url, u.created_at,
            u.social_links,
            COUNT(a.id) FILTER (WHERE a.status = 'published') as article_count
     FROM users u
     LEFT JOIN articles a ON a.author_id = u.id
     GROUP BY u.id
     ORDER BY u.created_at DESC`
  );
  return rows.map(user => ({
    ...user,
    article_count: Number(user.article_count)
  }));
};

module.exports = { findByEmail, findBySlug, findAll };
