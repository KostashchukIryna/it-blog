/**
 * Unified response helpers — every handler uses these so the
 * shape is always consistent with the spec.
 */

/** Single object response */
const ok = (res, data, status = 200) => res.status(status).json({ data });

/** Paginated list response */
const paginated = (res, data, { total, page, perPage }) =>
  res.status(200).json({
    data,
    meta: {
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    },
  });

/** Error response */
const error = (res, code, message, status = 400) =>
  res.status(status).json({ error: { code, message } });

/** Common shorthand errors */
const notFound = (res, message = "Not found") =>
  error(res, "NOT_FOUND", message, 404);

const unauthorized = (res, message = "Unauthorized") =>
  error(res, "UNAUTHORIZED", message, 401);

const forbidden = (res, message = "Forbidden") =>
  error(res, "FORBIDDEN", message, 403);

const serverError = (res, err) => {
  console.error(err);
  return error(res, "SERVER_ERROR", "Internal server error", 500);
};

module.exports = { ok, paginated, error, notFound, unauthorized, forbidden, serverError };
