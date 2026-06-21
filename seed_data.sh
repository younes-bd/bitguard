#!/bin/bash
echo "=================================================="
echo " 🚀 BitGuard Enterprise - Database Migration & Seed "
echo "=================================================="
echo ""
echo "This script bypasses the WSL /mnt/c/ SQLite lock by"
echo "temporarily copying the database to the native Linux"
echo "filesystem (~/), applying migrations, seeding data,"
echo "and copying it back!"
echo ""

cd backend

echo "[1/4] Setting up native Linux SQLite database..."
rm -f db.sqlite3
touch ~/db.sqlite3

# Activate virtual environment
source venv/bin/activate

# Temporarily point Django to the native Linux database
export DATABASE_URL="sqlite:///$HOME/db.sqlite3"
export CUSTOM_DB_PATH="$HOME/db.sqlite3"

echo "[2/4] Running Django Migrations natively..."
# We patch settings to read from env var or fallback
python3 manage.py makemigrations
python3 manage.py migrate

echo "[3/4] Seeding Enterprise Data..."
python3 manage.py seed_enterprise_data

echo "[4/4] Syncing database back to Windows filesystem..."
cp ~/db.sqlite3 ./db.sqlite3

echo ""
echo "✅ Success! All models migrated and data seeded!"
echo "=================================================="
