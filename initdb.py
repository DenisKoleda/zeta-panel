import os
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

basedir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(basedir, 'instance', 'db.sqlite')

Base = declarative_base()

class User(Base):
    __tablename__ = 'User'
    id = Column(Integer, primary_key=True, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)
    
class Motherboard(Base):
    __tablename__ = 'motherboard'
    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    ram = Column(String(200))
    m2 = Column(String(200))
    amount = Column(String(200))
    
class PC(Base):
    __tablename__ = 'pc'
    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    conf = Column(String(200))
    ip = Column(String(200))
    user = Column(String(200))
    smart = Column(String(200))

class Ram(Base):
    __tablename__ = 'ram'
    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    conf = Column(String(200))
    freq = Column(String(200))
    amount = Column(String(200))

engine = create_engine('sqlite:///' + db_path)
Base.metadata.create_all(engine)