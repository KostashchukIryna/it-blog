const { Router } = require("express");
const ctrl = require("../controllers/categories");

const router = Router();

router.get("/",                    ctrl.list);
// support slash-containing category paths, e.g. parent/child
router.get("/:path(*)/articles",   ctrl.articlesByCategory);
router.get("/:path(*)",            ctrl.getByPath);

module.exports = router;
