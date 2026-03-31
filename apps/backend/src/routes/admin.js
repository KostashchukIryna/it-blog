const { Router } = require("express");
const articleCtrl  = require("../controllers/articles");
const categoryCtrl = require("../controllers/categories");
const uploadCtrl   = require("../controllers/upload");
const { authenticate, requireAdmin } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = Router();

// Every admin route requires a valid JWT + admin flag
router.use(authenticate, requireAdmin);

/* ── Articles ─────────────────────────────────────────────────── */
router.get("/articles",      articleCtrl.adminList);
router.post("/articles",     articleCtrl.create);
router.put("/articles/:id",  articleCtrl.update);
router.delete("/articles/:id", articleCtrl.remove);

/* ── Categories ───────────────────────────────────────────────── */
router.get("/categories",        categoryCtrl.adminList);
router.post("/categories",       categoryCtrl.create);
router.put("/categories/:id",    categoryCtrl.update);
router.delete("/categories/:id", categoryCtrl.remove);

/* ── Upload ───────────────────────────────────────────────────── */
router.post("/upload", upload.single("image"), uploadCtrl.uploadImage);

module.exports = router;
