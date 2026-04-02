const { Pool } = require("pg");

// The 'pg' library can automatically use PG* environment variables if no config is passed.
// However, to be explicit and avoid any ambiguity, we read them directly.
// This ensures the connection uses the variables provided by Docker Compose.
const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT) || 5432,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
});

pool.on("error", (err) => {
  console.error("Unexpected DB pool error:", err);
});

module.exports = pool;
