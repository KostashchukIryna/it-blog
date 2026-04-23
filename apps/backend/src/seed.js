/**
 * seed.js — populate the DB with sample data for local development.
 * Run:  node src/seed.js
 */
require("dotenv").config();

const bcrypt = require("bcryptjs");
const db     = require("./db");

const hash = (p) => bcrypt.hash(p, 10);

// Допоміжна функція, щоб не перевантажувати API Unsplash запитами
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Набір заготовлених якісних зображень з офіційного API Unsplash для статей
const TECH_IMAGES = [
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1280&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1280&q=80",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1280&q=80",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1280&q=80",
  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1280&q=80",
  "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=1280&q=80",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1280&q=80",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1280&q=80",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1280&q=80",
  "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1280&q=80",
  "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1280&q=80",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1280&q=80",
  "https://images.unsplash.com/photo-1505238680356-667804448ae6?w=1280&q=80",
  "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=1280&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1280&q=80",
  "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1280&q=80",
  "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1280&q=80",
  "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=1280&q=80"
];

(async () => {
  try {
    /* ── Users ─────────────────────────────────────────────────── */
    const [admin] = (await db.query(
      `INSERT INTO users (name, slug, email, password, bio, is_admin, social_links)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (email) DO UPDATE SET name=EXCLUDED.name, bio=EXCLUDED.bio, social_links=EXCLUDED.social_links
       RETURNING id`,
      ["Admin User", "admin", "admin@example.com",
       await hash("secret123"), "Blog administrator and senior software architect with 10+ years of experience in full-stack development. Passionate about modern web technologies, DevOps practices, and building scalable applications.", true,
       JSON.stringify({
         "linkedin": "https://linkedin.com/in/admin-user",
         "github": "https://github.com/admin-user"
       })]
    )).rows;

    const [author] = (await db.query(
      `INSERT INTO users (name, slug, email, password, bio, social_links)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO UPDATE SET name=EXCLUDED.name, bio=EXCLUDED.bio, social_links=EXCLUDED.social_links
       RETURNING id`,
      ["Jane Doe", "jane-doe", "jane@example.com",
       await hash("secret123"), "Full-stack developer & tech writer with expertise in React, Node.js, and cloud architecture. Loves creating educational content and contributing to open source projects.",
       JSON.stringify({
         "linkedin": "https://linkedin.com/in/jane-doe-dev",
         "github": "https://github.com/jane-doe"
       })]
    )).rows;

    /* ── Categories ────────────────────────────────────────────── */
    const categories = [
      ["JavaScript", "javascript", "Everything about JS, from vanilla to frameworks."],
      ["Frontend",   "frontend",   "All things related to the client-side: HTML, CSS, React, Vue, etc."],
      ["Backend",    "backend",    "Server-side logic, APIs, and architecture."],
      ["DevOps",     "devops",     "CI/CD, Docker, Kubernetes, and infrastructure as code."],
      ["Databases",  "databases",  "SQL, NoSQL, data modeling, and performance."],
      ["Architecture", "architecture", "High-level design, patterns, and system design."],
      ["Career",     "career",     "Advice on interviews, growth, and best practices."],
    ];

    const catIds = {};
    for (const [name, slug, description] of categories) {
      const { rows } = await db.query(
        `INSERT INTO categories (name, slug, description)
         VALUES ($1,$2,$3)
         ON CONFLICT (slug) WHERE parent_id IS NULL
         DO UPDATE SET name=EXCLUDED.name, description=EXCLUDED.description
         RETURNING id, slug`,
        [name, slug, description]
      );
      catIds[rows[0].slug] = rows[0].id;
    }

    // Створюємо об'єкт для легкого пошуку slug категорії за її ID
    const categorySlugById = {};
    for (const [name, slug, description] of categories) {
      const id = catIds[slug];
      categorySlugById[id] = slug;
    }

    /* ── Tags ──────────────────────────────────────────────────── */
    const tagNames = [
      "node.js", "express", "postgresql", "docker", "tutorial", "beginner",
      "react", "vue", "typescript", "performance", "css", "nestjs", "graphql",
      "api", "microservices", "github-actions", "ci-cd", "terraform", "iac",
      "kubernetes", "sql", "nosql", "best-practices", "clean-code", "interview", "career"
    ];
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
        excerpt:    "A beginner-friendly introduction to building REST APIs with Node.js and the Express framework.",
        content:    "# Getting Started\n\nNode.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It's an easy way to build fast, scalable network applications. This tutorial will walk you through creating a simple REST API using Node.js and the Express framework.",
        author_id:  author.id,
        category_id: catIds["backend"],
        status:     "published",
        published_at: new Date(Date.now() - 2 * 86400000), // 2 days ago
        tags:       ["node-js", "express", "tutorial", "beginner", "api"],
      },
      {
        title:      "PostgreSQL Performance Tips",
        slug:       "postgresql-performance-tips",
        excerpt:    "Practical advice for faster queries and a more efficient database.",
        content:    "# Performance\n\nIndexes are your best friends when it comes to database performance. Make sure you are using them correctly. Use `EXPLAIN ANALYZE` to understand your query plans and identify bottlenecks. This article covers B-Tree, GIN, and partial indexes.",
        author_id:  admin.id,
        category_id: catIds["databases"],
        status:     "published",
        published_at: new Date(Date.now() - 10 * 86400000), // 10 days ago
        tags:       ["postgresql", "tutorial", "performance", "databases"],
      },
      {
        title:      "Docker for Developers — A Practical Intro",
        slug:       "docker-for-developers",
        excerpt:    "Containerise your apps easily and ensure consistency across all environments.",
        content:    "# Docker\n\nThis article is a work in progress. It will cover how to create a Dockerfile for a Node.js application, run it in a container, and use Docker Compose for multi-container setups.",
        author_id:  admin.id,
        category_id: catIds["devops"],
        status:     "draft",
        published_at: null,
        tags:       ["docker", "devops", "beginner"],
      },
      {
        title: "A Deep Dive into React Hooks",
        slug: "react-hooks-deep-dive",
        excerpt: "Go beyond useState and useEffect. Explore advanced hooks like useReducer, useCallback, and useMemo to optimize your React components.",
        content: "## Understanding React Hooks\n\nReact Hooks revolutionized how we write components. This guide explores some of the more advanced hooks that can help you write cleaner and more performant code.\n\n### useReducer\nFor complex state logic that involves multiple sub-values or when the next state depends on the previous one, `useReducer` is often a better choice than `useState`.\n\n### useCallback and useMemo\nTo prevent unnecessary re-renders in child components, `useCallback` and `useMemo` are essential tools. `useCallback` memoizes functions, while `useMemo` memoizes values.",
        author_id: author.id,
        category_id: catIds["frontend"],
        status: "published",
        published_at: new Date(Date.now() - 1 * 86400000), // 1 day ago
        tags: ["react", "javascript", "tutorial", "frontend"],
      },
      {
        title: "Modern State Management in Vue 3 with Pinia",
        slug: "vue-3-pinia-state-management",
        excerpt: "Vuex is great, but Pinia is the new official recommendation. Learn how to build scalable and type-safe stores with Pinia.",
        content: "## Why Pinia?\n\nPinia offers a simpler, more intuitive API and boasts excellent TypeScript support out of the box. It's designed to be modular, lightweight, and easy to use. Let's set up our first store and see how it works.",
        author_id: author.id,
        category_id: catIds["frontend"],
        status: "published",
        published_at: new Date(Date.now() - 3 * 86400000), // 3 days ago
        tags: ["vue", "javascript", "tutorial", "frontend"],
      },
      {
        title: "Mastering TypeScript Generics",
        slug: "mastering-typescript-generics",
        excerpt: "Unlock the full power of TypeScript by understanding generics. Create reusable, type-safe components and functions.",
        content: "## What are Generics?\n\nGenerics allow you to write code that can work over a variety of types rather than a single one. Think of them as variables for types. This enables you to create components and functions that are highly reusable while maintaining strict type safety.",
        author_id: admin.id,
        category_id: catIds["javascript"],
        status: "published",
        published_at: new Date(Date.now() - 5 * 86400000),
        tags: ["typescript", "javascript", "beginner", "best-practices"],
      },
      {
        title: "Core Web Vitals: A Practical Guide to Web Performance",
        slug: "core-web-vitals-guide",
        excerpt: "Improve your user experience and SEO rankings by focusing on Google's Core Web Vitals: LCP, FID, and CLS.",
        content: "## The Three Pillars of Core Web Vitals\n\n1. **Largest Contentful Paint (LCP):** Measures loading performance. Aim for an LCP of 2.5 seconds or less.\n2. **First Input Delay (FID):** Measures interactivity. An ideal FID is 100 milliseconds or less.\n3. **Cumulative Layout Shift (CLS):** Measures visual stability. A good CLS score is 0.1 or less.",
        author_id: admin.id,
        category_id: catIds["frontend"],
        status: "published",
        published_at: new Date(Date.now() - 7 * 86400000),
        tags: ["performance", "frontend", "devops"],
      },
      {
        title: "CSS Grid vs. Flexbox: Which One Should You Use?",
        slug: "css-grid-vs-flexbox",
        excerpt: "They are both powerful layout tools, but they solve different problems. Learn the key differences and when to use each.",
        content: "## One Dimension vs. Two Dimensions\n\nThe fundamental difference is that Flexbox is designed for one-dimensional layouts (a row OR a column), while Grid is designed for two-dimensional layouts (rows AND columns). Use Flexbox for component-level layouts and Grid for page-level layouts.",
        author_id: author.id,
        category_id: catIds["frontend"],
        status: "published",
        published_at: new Date(Date.now() - 8 * 86400000),
        tags: ["css", "frontend", "tutorial", "beginner"],
      },
      {
        title: "Building a Production-Ready REST API with NestJS",
        slug: "nestjs-rest-api-tutorial",
        excerpt: "Leverage the power of TypeScript and a modular architecture to build scalable and maintainable backend services with NestJS.",
        content: "## Setting up your NestJS Project\n\nStart by installing the NestJS CLI: `npm i -g @nestjs/cli`. Then, create a new project: `nest new project-name`. NestJS provides a robust, out-of-the-box application architecture that enables developers to create highly testable, scalable, loosely coupled, and easily maintainable applications.",
        author_id: admin.id,
        category_id: catIds["backend"],
        status: "published",
        published_at: new Date(Date.now() - 12 * 86400000),
        tags: ["nestjs", "typescript", "node-js", "backend", "api"],
      },
      {
        title: "GraphQL: A Query Language for your API",
        slug: "introduction-to-graphql",
        excerpt: "Tired of over-fetching and under-fetching with REST? Learn how GraphQL allows clients to request exactly the data they need.",
        content: "## The GraphQL Schema\n\nAt the core of any GraphQL API is its schema. The schema defines the types, queries, and mutations available to the client. This strong typing system allows for powerful developer tools and validation.",
        author_id: author.id,
        category_id: catIds["backend"],
        status: "published",
        published_at: new Date(Date.now() - 14 * 86400000),
        tags: ["graphql", "backend", "api", "architecture"],
      },
      {
        title: "An Introduction to Microservices Architecture",
        slug: "microservices-architecture-intro",
        excerpt: "Break down your monolith into smaller, independently deployable services. Explore the pros, cons, and common patterns of microservices.",
        content: "## What is a Microservice?\n\nA microservice is a small, autonomous service that works with others to form a larger application. The key is autonomy: each service can be developed, deployed, and scaled independently. This can lead to increased agility and resilience, but also introduces complexity in communication and data management.",
        author_id: admin.id,
        category_id: catIds["architecture"],
        status: "published",
        published_at: new Date(Date.now() - 15 * 86400000),
        tags: ["microservices", "architecture", "devops", "backend"],
      },
      {
        title: "Automate Your Workflow with GitHub Actions",
        slug: "github-actions-ci-cd",
        excerpt: "Learn how to set up a continuous integration and deployment pipeline directly in your GitHub repository.",
        content: "## Your First Workflow File\n\nCreate a file at `.github/workflows/main.yml`. This YAML file will define your CI/CD pipeline. You can specify jobs that run on different events, like a `push` to the main branch. Each job runs in its own virtual environment and can execute a series of steps, like installing dependencies, running tests, and deploying your application.",
        author_id: author.id,
        category_id: catIds["devops"],
        status: "published",
        published_at: new Date(Date.now() - 18 * 86400000),
        tags: ["github-actions", "devops", "ci-cd", "tutorial"],
      },
      {
        title: "Infrastructure as Code with Terraform",
        slug: "iac-with-terraform",
        excerpt: "Manage your cloud infrastructure with code. This guide introduces the basics of Terraform for provisioning and managing resources.",
        content: "## What is Infrastructure as Code (IaC)?\n\nIaC is the practice of managing and provisioning computer data centers through machine-readable definition files, rather than physical hardware configuration or interactive configuration tools. Terraform allows you to define your infrastructure in a declarative way, track its state, and apply changes predictably.",
        author_id: admin.id,
        category_id: catIds["devops"],
        status: "published",
        published_at: new Date(Date.now() - 20 * 86400000),
        tags: ["terraform", "devops", "iac", "architecture"],
      },
      {
        title: "Kubernetes 101: Understanding the Core Concepts",
        slug: "kubernetes-101-core-concepts",
        excerpt: "Demystify Kubernetes by learning about its fundamental building blocks: Pods, Services, Deployments, and more.",
        content: "## Pods, the smallest unit\n\nA Pod is the smallest and simplest unit in the Kubernetes object model that you create or deploy. A Pod represents a running process on your cluster and can contain one or more containers, such as Docker containers. Typically, you have one container per Pod.",
        author_id: author.id,
        category_id: catIds["devops"],
        status: "published",
        published_at: new Date(Date.now() - 22 * 86400000),
        tags: ["kubernetes", "docker", "devops", "tutorial"],
      },
      {
        title: "SQL vs. NoSQL: Choosing the Right Database",
        slug: "sql-vs-nosql",
        excerpt: "Relational or non-relational? Understand the key differences between SQL and NoSQL databases to make the right choice for your project.",
        content: "## Structure vs. Flexibility\n\nSQL databases are vertically scalable and have a predefined schema (e.g., PostgreSQL, MySQL). They are great for applications that require ACID compliance and have structured data. NoSQL databases are horizontally scalable and have a dynamic schema for unstructured data (e.g., MongoDB, Cassandra), making them suitable for big data and real-time applications.",
        author_id: admin.id,
        category_id: catIds["databases"],
        status: "published",
        published_at: new Date(Date.now() - 25 * 86400000),
        tags: ["sql", "nosql", "databases", "architecture", "beginner"],
      },
      {
        title: "Boost Your Queries with Advanced PostgreSQL Indexing",
        slug: "postgresql-advanced-indexing",
        excerpt: "Go beyond basic B-tree indexes. Learn about GIN, GiST, and partial indexes to dramatically improve your database performance.",
        content: "## When to use a GIN index?\n\nGeneralized Inverted Indexes (GIN) are useful when you need to index composite values where elements can appear multiple times, such as arrays (`text[]`) or full-text search documents (`tsvector`). They can significantly speed up queries that check for the presence of specific elements within these composite types.",
        author_id: author.id,
        category_id: catIds["databases"],
        status: "published",
        published_at: new Date(Date.now() - 28 * 86400000),
        tags: ["postgresql", "databases", "performance", "tutorial"],
      },
      {
        title: "Why Clean Code Matters (And How to Write It)",
        slug: "why-clean-code-matters",
        excerpt: "Code is read more often than it is written. Learn the principles of writing clean, readable, and maintainable code.",
        content: "## The Boy Scout Rule\n\n'Leave the campground cleaner than you found it.' This simple rule, applied to programming, can have a massive impact on the long-term health of a codebase. Every time you touch a piece of code, make a small improvement: rename a variable, extract a function, or add a comment. Over time, these small changes compound.",
        author_id: admin.id,
        category_id: catIds["career"],
        status: "published",
        published_at: new Date(Date.now() - 30 * 86400000),
        tags: ["clean-code", "career", "best-practices"],
      },
      {
        title: "Navigating the Technical Interview: A Survival Guide",
        slug: "technical-interview-guide",
        excerpt: "From coding challenges to system design questions, this guide covers what to expect and how to prepare for your next technical interview.",
        content: "## The STAR Method\n\nFor behavioral questions ('Tell me about a time when...'), use the STAR (Situation, Task, Action, Result) method to structure your answers. This provides a clear, concise, and compelling narrative that demonstrates your skills and experience effectively.",
        author_id: author.id,
        category_id: catIds["career"],
        status: "published",
        published_at: new Date(Date.now() - 35 * 86400000),
        tags: ["interview", "career", "best-practices"],
      },
    ];

    let imageIndex = 0;
    for (const a of articles) {
      const { tags, ...fields } = a; // 'tags' - це масив рядків, 'fields' - решта полів статті

      // Генеруємо тематичну URL-адресу для обкладинки, якщо вона не вказана
      if (!fields.cover_url) {
        // Беремо унікальне зображення з масиву по порядку без повторів
        fields.cover_url = TECH_IMAGES[imageIndex % TECH_IMAGES.length];
        imageIndex++;
        console.log(`   └─ Встановлено обкладинку для "${fields.title}"`);
      }

      const { rows } = await db.query(
        `INSERT INTO articles
           (title,slug,excerpt,content,cover_url,author_id,category_id,status,published_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, cover_url=EXCLUDED.cover_url
         RETURNING id`,
        [fields.title, fields.slug, fields.excerpt, fields.content,
         fields.cover_url,
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
