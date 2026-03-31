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
    const cat = await Category.findBySlug(req.params.slug);
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
    const { name, description } = req.body;
    if (!name) return error(res, "VALIDATION_ERROR", "name is required");

    const slug = makeSlug(name);
    const category = await Category.create({ name, slug, description });
    return ok(res, category, 201);
  } catch (err) {
    if (err.code === "23505") return error(res, "CONFLICT", "Category slug already exists", 409);
    return serverError(res, err);
  }
};

/** PUT /api/admin/categories/:id */
const update = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return error(res, "VALIDATION_ERROR", "name is required");

    const slug = makeSlug(name);
    const category = await Category.update(req.params.id, { name, slug, description });
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

module.exports = { list, articlesByCategory, adminList, create, update, remove };
