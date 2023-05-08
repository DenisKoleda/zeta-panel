#!/bin/bash

echo "Creating container Zeta-panel"
if [ ! -f data/app.db ]; then
    echo "Creating database"
    flask db init
    else
    echo "Database already exists"
fi

echo "Updating database"
flask db migrate
flask db upgrade
echo "Database updated"

echo "Launching gunicorn"
gunicorn wsgi:app \
    --bind 0.0.0.0:5000 \
    --workers $(nproc) \
    --threads $(nproc) \
    --worker-class=gthread \
    --access-logfile data/logs/access.log \
    --error-logfile data/logs/error.log \
    --log-level info
