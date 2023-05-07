#!/bin/bash

if [ -f data/app.db ]; then
    flask db init
fi

flask db migrate
flask db upgrade

gunicorn wsgi:app \
    --bind 0.0.0.0:5000 \
    --workers $(nproc) \
    --threads $(nproc) \
    --worker-class=gthread \
    --access-logfile - \
    --error-logfile - \
    --log-level info