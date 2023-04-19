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

class Ram(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    conf = db.Column(db.String(200))
    freq = db.Column(db.String(200))
    amount = db.Column(db.String(200))
    
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'conf': self.conf,
            'freq': self.freq,
            'amount': self.amount
        }
    
class Motherboard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    ram = db.Column(db.String(200))
    m2 = db.Column(db.String(200))
    amount = db.Column(db.String(200))
    
class PC(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    conf = db.Column(db.String(200))
    ip = db.Column(db.String(200))
    user = db.Column(db.String(200))
    smart = db.Column(db.String(200))
    
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'conf': self.conf,
            'ip': self.ip,
            'user': self.user,
            'smart': self.smart
        }