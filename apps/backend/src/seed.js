/**
 * seed.js — populate the DB with sample data for local development.
 * Run:  node src/seed.js
 */
require("dotenv").config();

const bcrypt = require("bcryptjs");
const db     = require("./db");

const hash = (p) => bcrypt.hash(p, 10);

(async () => {
  try {
    /* ── Users ─────────────────────────────────────────────────── */
    const [admin] = (await db.query(
      `INSERT INTO users (name, slug, email, password, bio, is_admin)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO UPDATE SET name=EXCLUDED.name
       RETURNING id`,
      ["Admin User", "admin", "admin@example.com",
       await hash("secret123"), "Blog administrator", true]
    )).rows;

    const [author] = (await db.query(
      `INSERT INTO users (name, slug, email, password, bio)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE SET name=EXCLUDED.name
       RETURNING id`,
      ["Jane Doe", "jane-doe", "jane@example.com",
       await hash("secret123"), "Full-stack developer & tech writer"]
    )).rows;

    /* ── Categories ────────────────────────────────────────────── */
    const categories = [
      ["JavaScript", "javascript", "Everything about JS"],
      ["DevOps",     "devops",     "CI/CD, Docker, Kubernetes"],
      ["Databases",  "databases",  "SQL, NoSQL, design"],
    ];

    const catIds = {};
    for (const [name, slug, description] of categories) {
      const { rows } = await db.query(
        `INSERT INTO categories (name, slug, description)
         VALUES ($1,$2,$3) ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name
         RETURNING id, slug`,
        [name, slug, description]
      );
      catIds[rows[0].slug] = rows[0].id;
    }

    /* ── Tags ──────────────────────────────────────────────────── */
    const tagNames = ["node.js", "express", "postgresql", "docker", "tutorial", "beginner"];
    const tagIds   = {};
    for (const name of tagNames) {
      const slug = name.replace(/\./g, "-");
      const { rows } = await db.query(
        `INSERT INTO tags (name, slug)
         VALUES ($1,$2) ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name
         RETURNING id, slug`,
        [name, slug]
      );
      tagIds[slug] = rows[0].id;
    }

    /* ── Articles ──────────────────────────────────────────────── */
    const articles = [
      {
        title:      "Getting Started with Node.js and Express",
        slug:       "getting-started-nodejs-express",
        excerpt:    "A beginner-friendly introduction to building REST APIs.",
        content:    "# Getting Started\n\nNode.js is a JavaScript runtime...",
        author_id:  author.id,
        category_id: catIds["javascript"],
        status:     "published",
        published_at: new Date(),
        tags:       ["node-js", "express", "tutorial", "beginner"],
      },
      {
        title:      "PostgreSQL Performance Tips",
        slug:       "postgresql-performance-tips",
        excerpt:    "Practical advice for faster queries.",
        content:    "# Performance\n\nIndexes are your best friends...",
        author_id:  admin.id,
        category_id: catIds["databases"],
        status:     "published",
        published_at: new Date(Date.now() - 86400000),
        tags:       ["postgresql", "tutorial"],
      },
      {
        title:      "Docker for Developers — Draft",
        slug:       "docker-for-developers",
        excerpt:    "Containerise your apps easily.",
        content:    "# Docker\n\nWork in progress...",
        author_id:  admin.id,
        category_id: catIds["devops"],
        status:     "draft",
        published_at: null,
        tags:       ["docker"],
      },
    ];

    for (const a of articles) {
      const { tags, ...fields } = a;
      const { rows } = await db.query(
        `INSERT INTO articles
           (title,slug,excerpt,content,author_id,category_id,status,published_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title
         RETURNING id`,
        [fields.title, fields.slug, fields.excerpt, fields.content,
         fields.author_id, fields.category_id, fields.status, fields.published_at]
      );
      const articleId = rows[0].id;

      // sync tags
      await db.query("DELETE FROM article_tags WHERE article_id=$1", [articleId]);
      for (const tSlug of tags) {
        const tid = tagIds[tSlug];
        if (tid) await db.query(
          "INSERT INTO article_tags (article_id, tag_id) VALUES ($1,$2) ON CONFLICT DO NOTHING",
          [articleId, tid]
        );
      }
    }

    console.log("🌱  Seed complete!");
    console.log("   admin@example.com  / secret123  (is_admin=true)");
    console.log("   jane@example.com   / secret123");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
})();
