const slugify = require("slugify");
const Article = require("../models/article");
const Tag = require("../models/tag");
const Category = require("../models/category");
const { ok, paginated, error, notFound, serverError } = require("../response");
const { parsePagination } = require("../pagination");

/* ─── helpers ──────────────────────────────────────────────────── */
const makeSlug = (text) =>
  slugify(text, { lower: true, strict: true, locale: "uk" });

/* ─── PUBLIC ───────────────────────────────────────────────────── */

/** GET /api/articles */
const list = async (req, res) => {
  try {
    const { page, perPage, offset } = parsePagination(req.query);
    const { rows, total } = await Article.findPublished({ limit: perPage, offset });
    return paginated(res, rows, { total, page, perPage });
  } catch (err) {
    return serverError(res, err);
  }
};

/** GET /api/articles/:slug */
const getBySlug = async (req, res) => {
  try {
    const article = await Article.findBySlug(req.params.slug);
    if (!article) return notFound(res, "Article not found");
    return ok(res, article);
  } catch (err) {
    return serverError(res, err);
  }
};

/** GET /api/articles/:slug/related */
const getRelated = async (req, res) => {
  try {
    const article = await Article.findBySlug(req.params.slug);
    if (!article) return notFound(res, "Article not found");

    const tagIds = (article.tags || []).map((t) => t.id);
    const related = await Article.findRelated(article.id, article.category?.id, tagIds);
    return ok(res, related);
  } catch (err) {
    return serverError(res, err);
  }
};

/** POST /api/articles/:id/view */
const incrementView = async (req, res) => {
  try {
    await Article.incrementViews(req.params.id);
    return ok(res, { message: "View counted" });
  } catch (err) {
    return serverError(res, err);
  }
};

/** GET /api/search?q=... */
const search = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return error(res, "VALIDATION_ERROR", "Query parameter 'q' is required");

    const { page, perPage, offset } = parsePagination(req.query);
    const { rows, total } = await Article.search(q, { limit: perPage, offset });
    return paginated(res, rows, { total, page, perPage });
  } catch (err) {
    return serverError(res, err);
  }
};

/* ─── ADMIN ────────────────────────────────────────────────────── */

/** GET /api/admin/articles */
const adminList = async (req, res) => {
  try {
    const { page, perPage, offset } = parsePagination(req.query);
    const { rows, total } = await Article.findAll({ limit: perPage, offset });
    return paginated(res, rows, { total, page, perPage });
  } catch (err) {
    return serverError(res, err);
  }
};

/** POST /api/admin/articles */
const create = async (req, res) => {
  try {
    const {
      title, excerpt, content, cover_url,
      category_id, status = "draft",
      meta_title, meta_description, tag_ids,
      published_at,
    } = req.body;

    if (!title || !content)
      return error(res, "VALIDATION_ERROR", "title and content are required");

    const slug = makeSlug(title);
    const author_id = req.user.id;
    const pub = status === "published" ? (published_at || new Date()) : null;

    const { id } = await Article.create({
      title, slug, excerpt, content, cover_url,
      author_id, category_id, status,
      meta_title, meta_description, published_at: pub,
    });

    if (tag_ids?.length) await Article.syncTags(id, tag_ids);

    const article = await Article.findById(id);
    return ok(res, article, 201);
  } catch (err) {
    if (err.code === "23505") return error(res, "CONFLICT", "Slug already exists", 409);
    return serverError(res, err);
  }
};

/** PUT /api/admin/articles/:id */
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, excerpt, content, cover_url,
      category_id, status,
      meta_title, meta_description, tag_ids,
      published_at,
    } = req.body;

    if (!title || !content)
      return error(res, "VALIDATION_ERROR", "title and content are required");

    const slug = makeSlug(title);
    const pub = status === "published" ? (published_at || new Date()) : null;

    const updated = await Article.update(id, {
      title, slug, excerpt, content, cover_url,
      category_id, status, meta_title, meta_description, published_at: pub,
    });

    if (!updated) return notFound(res, "Article not found");
    if (tag_ids !== undefined) await Article.syncTags(id, tag_ids);

    const article = await Article.findById(id);
    return ok(res, article);
  } catch (err) {
    if (err.code === "23505") return error(res, "CONFLICT", "Slug already exists", 409);
    return serverError(res, err);
  }
};

/** DELETE /api/admin/articles/:id */
const remove = async (req, res) => {
  try {
    const deleted = await Article.remove(req.params.id);
    if (!deleted) return notFound(res, "Article not found");
    return ok(res, { message: "Article deleted" });
  } catch (err) {
    return serverError(res, err);
  }
};

module.exports = {
  list, getBySlug, getRelated, incrementView, search,
  adminList, create, update, remove,
};
