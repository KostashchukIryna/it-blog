const path = require("path");
const { ok, error, serverError } = require("../response");

/** POST /api/admin/upload */
const uploadImage = (req, res) => {
  try {
    if (!req.file) return error(res, "VALIDATION_ERROR", "No image file provided");

    const host = `${req.protocol}://${req.get("host")}`;
    const url = `${host}/uploads/${req.file.filename}`;

    return ok(res, { url, filename: req.file.filename }, 201);
  } catch (err) {
    return serverError(res, err);
  }
};

module.exports = { uploadImage };
