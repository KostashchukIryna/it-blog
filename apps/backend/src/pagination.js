/**
 * Parse page / perPage from query string with safe defaults.
 * Returns { page, perPage, offset }.
 */
const parsePagination = (query, defaultPerPage = 10) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const perPage = Math.min(100, Math.max(1, parseInt(query.perPage) || defaultPerPage));
  const offset = (page - 1) * perPage;
  return { page, perPage, offset };
};

module.exports = { parsePagination };
