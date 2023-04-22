from . import db
from flask_login import UserMixin
import jwt
from time import time
from flask import current_app


class User(UserMixin, db.Model):
    __tablename__ = 'User'
    id = db.Column(db.Integer, primary_key=True)  # Идентификатор пользователя
    email = db.Column(db.String(200), unique=True)  # Адрес электронной почты
    password = db.Column(db.String(200))  # Пароль
    username = db.Column(db.String(200))  # Имя пользователя
    role = db.Columtn(db.String(200))  # Роль пользователя

class Ram(db.Model):
    __tablename__ = 'sklad_ram'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200))
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
    __tablename__ = 'sklad_motherboard'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    ram = db.Column(db.String(200))
    m2 = db.Column(db.String(200))
    amount = db.Column(db.String(200))
    
class PC(db.Model):
    __tablename__ = 'sklad_pc'
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
        
class Tasks(db.Model):
    #TODO добавить вырезанные элементы в работу
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(200))
    user_init = db.Column(db.String(200))
    ticket = db.Column(db.String(200))
    ticket_comment = db.Column(db.String(200))
    priority = db.Column(db.String(200))
    status = db.Column(db.String(200))
    executor = db.Column(db.String(200))
    # files = db.Column(db.String(200)) 
    deadline = db.Column(db.String(200))
    comment = db.Column(db.String(200))
    # time_started = db.Column(db.Integer(200))
    # time_finished = db.Column(db.Integer(200))
    # time_wasted = db.Column(db.Integer(200))
    
    def serialize(self):
        return {
            'id': self.id,
            'date': self.date,
            'user_init': self.user_init,
            'ticket': self.ticket,
            'ticket_comment': self.ticket_comment,
            'priority': self.priority,
            'status': self.status,
            'executor': self.executor,
            'deadline': self.deadline,
            'comment': self.comment
        }