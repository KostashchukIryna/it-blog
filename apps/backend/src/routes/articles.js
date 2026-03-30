const { Router } = require("express");
const ctrl = require("../controllers/articles");

const router = Router();

router.get("/",              ctrl.list);
router.get("/:slug",         ctrl.getBySlug);
router.get("/:slug/related", ctrl.getRelated);
router.post("/:id/view",     ctrl.incrementView);

module.exports = router;
