FROM python:3.11

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1

COPY requirements.txt requirements.txt

RUN pip3 install -r requirements.txt

ENV FLASK_APP=app.py
ENV TOKEN = ""
ENV SQLALCHEMY_DATABASE_URI="sqlite:///app.db"

RUN MKDIR instance

COPY . .

CMD ["sh", "start.sh"]
