FROM python:3.11

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
ENV FLASK_APP=app.py
ENV TOKEN = ""

# Создаем папку для хранения миграций и базы данных
RUN mkdir /app/data
RUN mkdir /app/data/logs
ENV SQLALCHEMY_DATABASE_URI="sqlite:////app/data/app.db"

COPY . .

CMD ["sh", "start.sh"]
