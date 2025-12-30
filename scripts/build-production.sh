#!/bin/bash
# Bash script to build frontend and backend for production
# Usage: ./scripts/build-production.sh

set -e  # Exit on error

echo "Building frontend..."
cd frontend
npm install
npm run build

echo "Frontend build complete!"
cd ..

echo "Building backend..."
cd backend
npm install
npm run build

echo "Backend build complete!"
cd ..

echo ""
echo "Production build complete!"
echo "Frontend output: frontend/dist/frontend/browser"
echo "Backend output: backend/dist"



