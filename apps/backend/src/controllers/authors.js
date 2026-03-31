const User = require("../models/user");
const Article = require("../models/article");
const { ok, paginated, notFound, serverError } = require("../response");
const { parsePagination } = require("../pagination");

/** GET /api/authors/:slug */
const getProfile = async (req, res) => {
  try {
    const user = await User.findBySlug(req.params.slug);
    if (!user) return notFound(res, "Author not found");
    return ok(res, user);
  } catch (err) {
    return serverError(res, err);
  }
};

/** GET /api/authors/:slug/articles */
const getArticles = async (req, res) => {
  try {
    const user = await User.findBySlug(req.params.slug);
    if (!user) return notFound(res, "Author not found");

    const { page, perPage, offset } = parsePagination(req.query);
    const { rows, total } = await Article.findPublished({
      limit: perPage, offset, authorId: user.id,
    });
    return paginated(res, rows, { total, page, perPage });
  } catch (err) {
    return serverError(res, err);
  }
};

module.exports = { getProfile, getArticles };
