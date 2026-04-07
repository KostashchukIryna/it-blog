#!/usr/bin/env node
/**
 * test-authors-api.js — Test the authors API endpoints
 * Usage: node test-authors-api.js
 */

require("dotenv").config();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_BASE = process.env.API_BASE || 'http://localhost:3001';

async function testEndpoint(name, url) {
  try {
    console.log(`\n📡 Testing ${name}: ${url}`);
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      console.log(`❌ Error ${response.status}:`, data);
      return false;
    }
    
    console.log(`✅ Success:`, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.log(`❌ Request failed:`, err.message);
    return false;
  }
}

(async () => {
  console.log("🚀 Testing Authors API Endpoints");
  console.log(`Base URL: ${API_BASE}`);
  
  const tests = [
    ["List all authors", `${API_BASE}/api/authors`],
    ["Get specific author", `${API_BASE}/api/authors/jane-doe`],
    ["Get author's articles", `${API_BASE}/api/authors/jane-doe/articles`],
    ["Get article with author info", `${API_BASE}/api/articles/getting-started-nodejs-express`]
  ];
  
  let passed = 0;
  for (const [name, url] of tests) {
    if (await testEndpoint(name, url)) {
      passed++;
    }
  }
  
  console.log(`\n📊 Results: ${passed}/${tests.length} tests passed`);
  process.exit(passed === tests.length ? 0 : 1);
})();