const { Router } = require("express");
const ctrl = require("../controllers/authors");

const router = Router();

router.get("/:slug",          ctrl.getProfile);
router.get("/:slug/articles", ctrl.getArticles);

module.exports = router;
