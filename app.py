# app.py
from flask import Flask
from flask_cors import CORS
from database import db
from routes.atracoes import atracoes_bp # Importa o Blueprint de rotas

app = Flask(__name__)
CORS(app)

# Configuração do Banco de Dados
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ferris_wheel.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializa o banco de dados conectando-o ao app
db.init_app(app)

# Registra as rotas com um prefixo '/api'
app.register_blueprint(atracoes_bp, url_prefix='/api')

if __name__ == '__main__':
    with app.app_context():
        db.create_all() # Garante que as tabelas mapeadas nos modelos sejam criadas
    app.run(debug=True)