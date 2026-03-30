const db = require("../db");
const Tag = require("../models/tag");
const Article = require("../models/article");
const { ok, paginated, notFound, serverError } = require("../response");
const { parsePagination } = require("../pagination");

/** GET /api/tags */
const list = async (_req, res) => {
  try {
    const tags = await Tag.findAll();
    return ok(res, tags);
  } catch (err) {
    return serverError(res, err);
  }
};

/** GET /api/tags/:slug/articles */
const articlesByTag = async (req, res) => {
  try {
    const tag = await Tag.findBySlug(req.params.slug);
    if (!tag) return notFound(res, "Tag not found");

    const { page, perPage, offset } = parsePagination(req.query);

    const [{ rows }, { rows: count }] = await Promise.all([
      db.query(
        `SELECT a.id, a.title, a.slug, a.excerpt, a.cover_url,
                a.published_at, a.views,
                json_build_object('id', u.id, 'name', u.name, 'slug', u.slug) AS author
         FROM articles a
         JOIN article_tags at ON at.article_id = a.id
         LEFT JOIN users u ON u.id = a.author_id
         WHERE at.tag_id = $1 AND a.status = 'published'
         ORDER BY a.published_at DESC
         LIMIT $2 OFFSET $3`,
        [tag.id, perPage, offset]
      ),
      db.query(
        `SELECT COUNT(*) FROM articles a
         JOIN article_tags at ON at.article_id = a.id
         WHERE at.tag_id = $1 AND a.status = 'published'`,
        [tag.id]
      ),
    ]);

    return paginated(res, rows, { total: Number(count[0].count), page, perPage });
  } catch (err) {
    return serverError(res, err);
  }
};

module.exports = { list, articlesByTag };
