from . import db
from flask_login import UserMixin


class User(UserMixin, db.Model):
    __tablename__ = 'User'
    id = db.Column(db.Integer, primary_key=True)  # Идентификатор пользователя
    email = db.Column(db.String(200), unique=True)  # Адрес электронной почты
    password = db.Column(db.String(200))  # Пароль
    username = db.Column(db.String(200))  # Имя пользователя
    role = db.Column(db.String(200))  # Роль пользователя
    telegram = db.Column(db.String()) # Телеграм айди пользователя

class Ram(db.Model):
    __tablename__ = 'sklad_ram'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200))
    type = db.Column(db.String(200))
    size = db.Column(db.String(200))
    frequency = db.Column(db.String(200))
    count = db.Column(db.Integer)
    
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'size': self.size,
            'frequency': self.frequency,
            'count': self.count
        }
        
class Miscellaneous(db.Model):
    __tablename__ = 'sklad_miscellaneous'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200))
    type = db.Column(db.String(200))
    conf = db.Column(db.String(200))
    count = db.Column(db.Integer)
    
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'conf': self.conf,
            'count': self.count
        }

class Network(db.Model):
    __tablename__ = 'sklad_network'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200))
    type = db.Column(db.String(200))
    ports = db.Column(db.String(200))
    count = db.Column(db.Integer)
    
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'ports': self.ports,
            'count': self.count
        }
    
class Harddrive(db.Model):
    __tablename__ = 'sklad_harddrive'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200))
    type = db.Column(db.String(200))
    size = db.Column(db.String(200))
    count = db.Column(db.Integer)
    
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'size': self.size,
            'count': self.count
        }
    
class Motherboard(db.Model):
    __tablename__ = 'sklad_motherboard'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    ram = db.Column(db.String(200))
    m2 = db.Column(db.String(200))
    count = db.Column(db.String(200))
    
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'ram': self.ram,
            'm2': self.m2,
            'count': self.count
        }
    
class PC(db.Model):
    __tablename__ = 'sklad_pc'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    conf = db.Column(db.String(200))
    ip = db.Column(db.String(200))
    user = db.Column(db.String(200))
    smart = db.Column(db.Text)
    comment = db.Column(db.Text)
    
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'conf': self.conf,
            'ip': self.ip,
            'user': self.user,
            'smart': self.smart,
            'comment': self.comment
        }
        
class Tasks(db.Model):
    #TODO добавить вырезанные элементы в работу
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(200))
    user_init = db.Column(db.String(200))
    ticket = db.Column(db.String(200))
    ticket_comment = db.Column(db.Text)
    priority = db.Column(db.String(200))
    status = db.Column(db.String(200))
    executor = db.Column(db.String(200))
    # files = db.Column(db.String(200)) 
    deadline = db.Column(db.String(200))
    comment = db.Column(db.Text)
    time_started = db.Column(db.String(200))
    time_finished = db.Column(db.String(200))
    time_wasted = db.Column(db.String(200))
    
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
            'comment': self.comment,
            'time_started': self.time_started,
            'time_finished': self.time_finished,
            'time_wasted': self.time_wasted
        }
        
class Badgeev(db.Model):
    __tablename__ = 'sklad_badgeev'
    id = db.Column(db.Integer, primary_key=True)
    ip = db.Column(db.String(200))
    vlan = db.Column(db.Integer)
    cores = db.Column(db.String(200))
    config = db.Column(db.String(200))
    status = db.Column(db.String(200))
    smart = db.Column(db.Text)
    switch = db.Column(db.String(200))
    switch_port = db.Column(db.String(200))
    rack = db.Column(db.String(200))
    comment = db.Column(db.Text)
    
    def serialize(self):
        return {
            'id': self.id,
            'ip': self.ip,
            'vlan': self.vlan,
            'cores': self.cores,
            'config': self.config,
            'status': self.status,
            'smart': self.smart,
            'switch': self.switch,
            'switch_port': self.switch_port,
            'rack': self.rack,
            'comment': self.comment
        }