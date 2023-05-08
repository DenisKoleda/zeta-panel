FROM python:3.11

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1

COPY requirements.txt requirements.txt

RUN pip3 install -r requirements.txt

ENV FLASK_APP=app.py
ENV TOKEN = ""
ENV SQLALCHEMY_DATABASE_URI="sqlite:////app/data/app.db"

# Создаем папку для хранения миграций и базы данных
RUN mkdir /app/data

COPY . .

CMD ["sh", "start.sh"]
