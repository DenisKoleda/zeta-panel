#!/bin/bash

echo "Запуск контейнера zeta-panel"
if [ -f data/app.db ]; then
    echo "Создание базы данных"
    flask db init
fi

echo "Обновление базы данных"
flask db migrate
flask db upgrade
echo "Обновление базы данных завершено"

echo "Запуск веб сервера"
gunicorn wsgi:app \
    --bind 0.0.0.0:5000 \
    --workers $(nproc) \
    --threads $(nproc) \
    --worker-class=gthread \
    --access-logfile - \
    --error-logfile - \
    --log-level info