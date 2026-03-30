require("dotenv").config();

const fs   = require("fs");
const path = require("path");
const db   = require("./db");

const MIGRATIONS_DIR = path.join(__dirname, "../migrations");

(async () => {
  try {
    const files = fs.readdirSync(MIGRATIONS_DIR)
      .filter(f => f.endsWith(".sql"))
      .sort();

    for (const file of files) {
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");
      console.log(`Running migration: ${file}...`);
      await db.query(sql);
      console.log(`Done: ${file}`);
    }

    console.log("\nAll migrations applied successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
})();
