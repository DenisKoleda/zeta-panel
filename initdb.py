import os
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base

basedir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(basedir, 'instance', 'db.sqlite')

Base = declarative_base()

class User(Base):
    __tablename__ = 'User'
    id = Column(Integer, primary_key=True, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)
    
class Motherboard(Base):
    __tablename__ = 'sklad_motherboard'
    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    ram = Column(String(200))
    m2 = Column(String(200))
    count = Column(String(200))
    
class PC(Base):
    __tablename__ = 'sklad_pc'
    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    conf = Column(String(200))
    ip = Column(String(200))
    user = Column(String(200))
    smart = Column(String(200))
    comment = Column(String(200))

class Ram(Base):
    __tablename__ = 'sklad_ram'
    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    type = Column(String(200))
    size = Column(String(200))
    frequency = Column(String(200))
    count = Column(String(200))
    
class Harddrive(Base):
    __tablename__ = 'sklad_harddrive'
    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    type = Column(String(200))
    ports = Column(String(200))
    count = Column(String(200))

class Network(Base):
    __tablename__ = 'sklad_harddrive'
    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    type = Column(String(200))
    size = Column(String(200))
    count = Column(String(200))
    
class Tasks(Base):
    __tablename__ = 'tasks'
    id = Column(Integer, primary_key=True)
    date = Column(String(200))
    user_init = Column(String(200))
    ticket = Column(String(200))
    ticket_comment = Column(String(200))
    priority = Column(String(200))
    status = Column(String(200))
    executor = Column(String(200))
    # files = Column(String(200)) 
    deadline = Column(String(200))
    comment = Column(String(200))
    # time_started = Column(Integer(200))
    # time_finished = Column(Integer(200))
    # time_wasted = Column(Integer(200))
    
class Badgeev(Base):
    __tablename__ = 'sklad_badgeev'
    id = Column(Integer, primary_key=True)
    ip = Column(String(200))
    vlan = Column(Integer)
    cores = Column(String(200))
    config = Column(String(200))
    status = Column(String(200))
    smart = Column(String(200))
    switch = Column(String(200))
    switch_port = Column(String(200))
    rack = Column(String(200))
    comment = Column(String(200))

engine = create_engine('sqlite:///' + db_path)
Base.metadata.create_all(engine)

print('База данных создана')
