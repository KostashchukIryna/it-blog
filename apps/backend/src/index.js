require("dotenv").config();

const express = require("express");
const cors    = require("cors");
const path    = require("path");

const app = express();

/* ── Global middleware ─────────────────────────────────────────── */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images as static files
const uploadDir = path.resolve(process.env.UPLOAD_DIR || "uploads");
app.use("/uploads", express.static(uploadDir));

/* ── Routes ────────────────────────────────────────────────────── */
app.use("/api/auth",        require("./routes/auth"));
app.use("/api/articles",    require("./routes/articles"));
app.use("/api/categories",  require("./routes/categories"));
app.use("/api/tags",        require("./routes/tags"));
app.use("/api/authors",     require("./routes/authors"));
app.use("/api/search",      require("./routes/search"));
app.use("/api/admin",       require("./routes/admin"));

/* ── Health check ──────────────────────────────────────────────── */
app.get("/health", (_req, res) => res.json({ status: "ok" }));

/* ── 404 handler ───────────────────────────────────────────────── */
app.use((_req, res) =>
  res.status(404).json({ error: { code: "NOT_FOUND", message: "Route not found" } })
);

/* ── Global error handler ──────────────────────────────────────── */
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: { code: "SERVER_ERROR", message: "Internal server error" } });
});

/* ── Start ─────────────────────────────────────────────────────── */
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`  IT Blog API running on http://${HOST}:${PORT}`);
  console.log(`  External access: Ready for connections`);
});
