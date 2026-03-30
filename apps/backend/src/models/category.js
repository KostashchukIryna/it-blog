const db = require("../db");

const findAll = async () => {
  const { rows } = await db.query("SELECT * FROM categories ORDER BY name");
  return rows;
};

const findBySlug = async (slug) => {
  const { rows } = await db.query("SELECT * FROM categories WHERE slug = $1", [slug]);
  return rows[0] || null;
};

const findById = async (id) => {
  const { rows } = await db.query("SELECT * FROM categories WHERE id = $1", [id]);
  return rows[0] || null;
};

const create = async ({ name, slug, description }) => {
  const { rows } = await db.query(
    "INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3) RETURNING *",
    [name, slug, description]
  );
  return rows[0];
};

const update = async (id, { name, slug, description }) => {
  const { rows } = await db.query(
    "UPDATE categories SET name=$1, slug=$2, description=$3 WHERE id=$4 RETURNING *",
    [name, slug, description, id]
  );
  return rows[0] || null;
};

const remove = async (id) => {
  const { rowCount } = await db.query("DELETE FROM categories WHERE id = $1", [id]);
  return rowCount > 0;
};

module.exports = { findAll, findBySlug, findById, create, update, remove };
