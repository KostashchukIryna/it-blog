const db = require("../db");

/* ── shared SELECT fragment ───────────────────────────────────── */
const ARTICLE_SELECT = `
  a.id, a.title, a.slug, a.excerpt, a.content, a.cover_url,
  a.status, a.views, a.meta_title, a.meta_description,
  a.published_at, a.created_at, a.updated_at,
  json_build_object('id', u.id, 'name', u.name, 'slug', u.slug, 'avatar_url', u.avatar_url, 'bio', u.bio, 'social_links', u.social_links) AS author,
  json_build_object('id', c.id, 'name', c.name, 'slug', c.slug) AS category,
  COALESCE(
    json_agg(DISTINCT jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
    FILTER (WHERE t.id IS NOT NULL), '[]'
  ) AS tags
FROM articles a
LEFT JOIN users      u  ON u.id = a.author_id
LEFT JOIN categories c  ON c.id = a.category_id
LEFT JOIN article_tags at ON at.article_id = a.id
LEFT JOIN tags       t  ON t.id = at.tag_id
`;

const GROUP_BY = `
GROUP BY a.id, u.id, c.id
`;

/* ── public list ─────────────────────────────────────────────── */
const findPublished = async ({ limit, offset, categoryId, authorId }) => {
  const params = [];
  let where = "WHERE a.status = 'published'";

  if (categoryId) { params.push(categoryId); where += ` AND a.category_id = $${params.length}`; }
  if (authorId)   { params.push(authorId);   where += ` AND a.author_id   = $${params.length}`; }

  params.push(limit, offset);

  const [{ rows }, { rows: count }] = await Promise.all([
    db.query(`SELECT ${ARTICLE_SELECT} ${where} ${GROUP_BY} ORDER BY a.published_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`, params),
    db.query(`SELECT COUNT(*) FROM articles a ${where}`, params.slice(0, -2)),
  ]);

  return { rows, total: Number(count[0].count) };
};

/* ── admin list (all statuses) ───────────────────────────────── */
const findAll = async ({ limit, offset }) => {
  const [{ rows }, { rows: count }] = await Promise.all([
    db.query(`SELECT ${ARTICLE_SELECT} ${GROUP_BY} ORDER BY a.created_at DESC LIMIT $1 OFFSET $2`, [limit, offset]),
    db.query("SELECT COUNT(*) FROM articles"),
  ]);
  return { rows, total: Number(count[0].count) };
};

/* ── single article by slug ──────────────────────────────────── */
const findBySlug = async (slug, publishedOnly = true) => {
  const where = publishedOnly
    ? "WHERE a.slug = $1 AND a.status = 'published'"
    : "WHERE a.slug = $1";
  const { rows } = await db.query(`SELECT ${ARTICLE_SELECT} ${where} ${GROUP_BY}`, [slug]);
  return rows[0] || null;
};

/* ── single article by id ────────────────────────────────────── */
const findById = async (id) => {
  const { rows } = await db.query(`SELECT ${ARTICLE_SELECT} WHERE a.id = $1 ${GROUP_BY}`, [id]);
  return rows[0] || null;
};

/* ── related articles ────────────────────────────────────────── */
const findRelated = async (articleId, categoryId, tagIds, limit = 5) => {
  const { rows } = await db.query(
    `SELECT ${ARTICLE_SELECT}
     LEFT JOIN article_tags at2 ON at2.article_id = a.id
     WHERE a.id <> $1
       AND a.status = 'published'
       AND (a.category_id = $2 OR at2.tag_id = ANY($3::int[]))
     ${GROUP_BY}
     ORDER BY a.published_at DESC
     LIMIT $4`,
    [articleId, categoryId, tagIds, limit]
  );
  return rows;
};

/* ── increment view counter ──────────────────────────────────── */
const incrementViews = async (id) => {
  await db.query("UPDATE articles SET views = views + 1 WHERE id = $1", [id]);
};

/* ── search ──────────────────────────────────────────────────── */
const search = async (q, { limit, offset }) => {
  const like = `%${q}%`;
  const [{ rows }, { rows: count }] = await Promise.all([
    db.query(
      `SELECT ${ARTICLE_SELECT}
       WHERE a.status = 'published'
         AND (a.title ILIKE $1 OR a.excerpt ILIKE $1 OR a.content ILIKE $1)
       ${GROUP_BY}
       ORDER BY a.published_at DESC
       LIMIT $2 OFFSET $3`,
      [like, limit, offset]
    ),
    db.query(
      `SELECT COUNT(*) FROM articles a
       WHERE a.status = 'published'
         AND (a.title ILIKE $1 OR a.excerpt ILIKE $1 OR a.content ILIKE $1)`,
      [like]
    ),
  ]);
  return { rows, total: Number(count[0].count) };
};

/* ── create ──────────────────────────────────────────────────── */
const create = async (fields) => {
  const {
    title, slug, excerpt, content, cover_url,
    author_id, category_id, status,
    meta_title, meta_description, published_at,
  } = fields;

  const { rows } = await db.query(
    `INSERT INTO articles
       (title, slug, excerpt, content, cover_url, author_id, category_id,
        status, meta_title, meta_description, published_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING id`,
    [title, slug, excerpt, content, cover_url, author_id, category_id,
     status, meta_title, meta_description, published_at]
  );
  return rows[0];
};

/* ── update ──────────────────────────────────────────────────── */
const update = async (id, fields) => {
  const {
    title, slug, excerpt, content, cover_url,
    category_id, status, meta_title, meta_description, published_at,
  } = fields;

  const { rows } = await db.query(
    `UPDATE articles SET
       title=$1, slug=$2, excerpt=$3, content=$4, cover_url=$5,
       category_id=$6, status=$7, meta_title=$8, meta_description=$9,
       published_at=$10, updated_at=NOW()
     WHERE id=$11
     RETURNING id`,
    [title, slug, excerpt, content, cover_url,
     category_id, status, meta_title, meta_description, published_at, id]
  );
  return rows[0] || null;
};

/* ── delete ──────────────────────────────────────────────────── */
const remove = async (id) => {
  const { rowCount } = await db.query("DELETE FROM articles WHERE id = $1", [id]);
  return rowCount > 0;
};

/* ── sync tags for an article ────────────────────────────────── */
const syncTags = async (articleId, tagIds) => {
  await db.query("DELETE FROM article_tags WHERE article_id = $1", [articleId]);
  if (!tagIds?.length) return;
  const values = tagIds.map((tid, i) => `($1, $${i + 2})`).join(",");
  await db.query(
    `INSERT INTO article_tags (article_id, tag_id) VALUES ${values} ON CONFLICT DO NOTHING`,
    [articleId, ...tagIds]
  );
};

module.exports = {
  findPublished, findAll, findBySlug, findById, findRelated,
  incrementViews, search, create, update, remove, syncTags,
};
