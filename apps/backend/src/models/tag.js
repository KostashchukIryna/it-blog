const db = require("../db");

const findAll = async () => {
  const { rows } = await db.query("SELECT * FROM tags ORDER BY name");
  return rows;
};

const findBySlug = async (slug) => {
  const { rows } = await db.query("SELECT * FROM tags WHERE slug = $1", [slug]);
  return rows[0] || null;
};

const findByIds = async (ids) => {
  const { rows } = await db.query("SELECT * FROM tags WHERE id = ANY($1::int[])", [ids]);
  return rows;
};

module.exports = { findAll, findBySlug, findByIds };
