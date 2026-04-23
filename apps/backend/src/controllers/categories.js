const slugify = require("slugify");
const Category = require("../models/category");
const Article = require("../models/article");
const { ok, paginated, error, notFound, serverError } = require("../response");
const { parsePagination } = require("../pagination");

const makeSlug = (t) => slugify(t, { lower: true, strict: true, locale: "uk" });

/** GET /api/categories */
const list = async (_req, res) => {
  try {
    const categories = await Category.findAll();
    return ok(res, categories);
  } catch (err) {
    return serverError(res, err);
  }
};

/** GET /api/categories/:slug/articles */
const articlesByCategory = async (req, res) => {
  try {
    const path = req.params.path || req.params.slug || "";
    // support both single slug and slash-separated paths
    const cat = await Category.findByPath(path);
    if (!cat) return notFound(res, "Category not found");

    const { page, perPage, offset } = parsePagination(req.query);
    const { rows, total } = await Article.findPublished({
      limit: perPage, offset, categoryId: cat.id,
    });
    return paginated(res, rows, { total, page, perPage });
  } catch (err) {
    return serverError(res, err);
  }
};

/** GET /api/categories/:path */
const getByPath = async (req, res) => {
  try {
    const path = req.params.path || req.params.slug || "";
    const cat = await Category.findByPath(path);
    if (!cat) return notFound(res, "Category not found");
    return ok(res, cat);
  } catch (err) {
    return serverError(res, err);
  }
};

/** GET /api/admin/categories */
const adminList = async (_req, res) => {
  try {
    const categories = await Category.findAll();
    return ok(res, categories);
  } catch (err) {
    return serverError(res, err);
  }
};

/** POST /api/admin/categories */
const create = async (req, res) => {
  try {
    const { name, description, parent_id } = req.body;
    if (!name) return error(res, "VALIDATION_ERROR", "name is required");

    const slug = makeSlug(name);
    const category = await Category.create({ name, slug, description, parent_id });
    return ok(res, category, 201);
  } catch (err) {
    if (err.code === "23505") return error(res, "CONFLICT", "Category slug already exists", 409);
    return serverError(res, err);
  }
};

/** PUT /api/admin/categories/:id */
const update = async (req, res) => {
  try {
    const { name, description, parent_id } = req.body;
    if (!name) return error(res, "VALIDATION_ERROR", "name is required");

    const slug = makeSlug(name);
    const category = await Category.update(req.params.id, { name, slug, description, parent_id });
    if (!category) return notFound(res, "Category not found");
    return ok(res, category);
  } catch (err) {
    if (err.code === "23505") return error(res, "CONFLICT", "Category slug already exists", 409);
    return serverError(res, err);
  }
};

/** DELETE /api/admin/categories/:id */
const remove = async (req, res) => {
  try {
    const deleted = await Category.remove(req.params.id);
    if (!deleted) return notFound(res, "Category not found");
    return ok(res, { message: "Category deleted" });
  } catch (err) {
    return serverError(res, err);
  }
};

module.exports = { list, articlesByCategory, getByPath, adminList, create, update, remove };
