const db = require("../db");

const findAll = async () => {
  const { rows } = await db.query(
    "SELECT * FROM categories ORDER BY parent_id NULLS FIRST, name"
  );
  return rows;
};

const findBySlug = async (slug) => {
  const { rows } = await db.query("SELECT * FROM categories WHERE slug = $1", [slug]);
  return rows[0] || null;
};

// Find category by a slash-separated path, e.g. "parent/child/grandchild"
const findByPath = async (path) => {
  if (!path) return null;
  const parts = path.split("/").filter(Boolean);

  // find top level (parent_id IS NULL)
  let parentId = null;
  let category = null;

  for (const part of parts) {
    const { rows } = await db.query(
      "SELECT * FROM categories WHERE slug = $1 AND " +
        (parentId === null ? "parent_id IS NULL" : "parent_id = $2") +
        " LIMIT 1",
      parentId === null ? [part] : [part, parentId]
    );
    category = rows[0] || null;
    if (!category) return null;
    parentId = category.id;
  }

  return category;
};

const findById = async (id) => {
  const { rows } = await db.query("SELECT * FROM categories WHERE id = $1", [id]);
  return rows[0] || null;
};

const create = async ({ name, slug, description, parent_id = null }) => {
  const { rows } = await db.query(
    "INSERT INTO categories (name, slug, description, parent_id) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, slug, description, parent_id]
  );
  return rows[0];
};

const update = async (id, { name, slug, description, parent_id = null }) => {
  const { rows } = await db.query(
    "UPDATE categories SET name=$1, slug=$2, description=$3, parent_id=$4 WHERE id=$5 RETURNING *",
    [name, slug, description, parent_id, id]
  );
  return rows[0] || null;
};

const remove = async (id) => {
  const { rowCount } = await db.query("DELETE FROM categories WHERE id = $1", [id]);
  return rowCount > 0;
};

module.exports = { findAll, findBySlug, findByPath, findById, create, update, remove };
