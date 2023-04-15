from . import db
from flask_login import UserMixin
import jwt
from time import time
from flask import current_app


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Идентификатор пользователя
    email = db.Column(db.String(100), unique=True)  # Адрес электронной почты
    password = db.Column(db.String(100))  # Пароль
    username = db.Column(db.String(1000))  # Имя пользователя

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(200))