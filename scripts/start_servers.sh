#!/bin/bash

# Script to start development servers bound to 0.0.0.0 
# so they are accessible from the Windows host browser.

echo "Starting BitGuard Development Servers..."

# Change to project root relative to script
cd "$(dirname "$0")/.." || exit

# Start Backend Server
echo "Starting Django Backend on 0.0.0.0:8000..."
cd backend || exit
env/bin/python manage.py runserver 0.0.0.0:8000 &
BACKEND_PID=$!
cd ..

# Start Frontend Server
echo "Starting Vite Frontend on 0.0.0.0:3000..."
cd frontend || exit
npm run dev -- --host &
FRONTEND_PID=$!
cd ..

echo "Servers are starting in the background."
echo "Press Ctrl+C to stop them."

# Wait for user interrupt
wait $BACKEND_PID $FRONTEND_PID
