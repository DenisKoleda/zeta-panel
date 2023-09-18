FROM python:3.11

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
ENV FLASK_APP=app.py
ENV TOKEN = ""
ENV SQLALCHEMY_DATABASE_URI="sqlite:///app.db"

RUN mkdir /app/instance
RUN mkdir /app/migrations
RUN mkdir -p /app/app/static/upload
RUN mkdir -p /app/app/static/download
RUN mkdir /app/logs

COPY . .

EXPOSE 5000

CMD ["sh", "start.sh"]
