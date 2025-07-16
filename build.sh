#!/bin/bash
# Vercel build script

echo "Building Travel Carbon Tracker..."

# Install dependencies
npm install

# Build the application
npm run build

echo "Build completed successfully!"