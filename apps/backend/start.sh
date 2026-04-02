#!/bin/bash

# Run database migrations
echo "Running database migrations..."
node src/migrate.js

# Run database seeding (only if tables are empty)
echo "Running database seeding..."
node src/seed.js

# Start the main application
echo "Starting application..."
node src/index.js