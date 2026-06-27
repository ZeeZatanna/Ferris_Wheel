# models/atracao.py
from database import db

class Atracao(db.Model):
    __tablename__ = 'atracoes'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    capacidade = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(50), default="Ativo")