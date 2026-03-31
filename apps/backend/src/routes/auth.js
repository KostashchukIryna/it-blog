const { Router } = require("express");
const { login, logout } = require("../controllers/auth");
const { authenticate } = require("../middleware/auth");

const router = Router();

router.post("/login", login);
router.post("/logout", authenticate, logout);

module.exports = router;
