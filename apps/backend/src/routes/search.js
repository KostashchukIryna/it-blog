const { Router } = require("express");
const { search } = require("../controllers/articles");

const router = Router();

router.get("/", search);

module.exports = router;
