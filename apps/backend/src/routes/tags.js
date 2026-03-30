const { Router } = require("express");
const ctrl = require("../controllers/tags");

const router = Router();

router.get("/",                 ctrl.list);
router.get("/:slug/articles",   ctrl.articlesByTag);

module.exports = router;
