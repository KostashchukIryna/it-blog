const { Router } = require("express");
const ctrl = require("../controllers/categories");

const router = Router();

router.get("/",                    ctrl.list);
router.get("/:slug/articles",      ctrl.articlesByCategory);

module.exports = router;
