#!/bin/bash

echo "Creating container Zeta-panel"
if [ ! -f instance/app.db ]; then
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
    --access-logfile=logs/gunicorn_access.log \
    --error-logfile=logs/gunicorn_error.log \
    --log-level debug \
    --log-file=logs/gunicorn.log
