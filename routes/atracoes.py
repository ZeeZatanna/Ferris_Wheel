# routes/atracoes.py
from flask import Blueprint, jsonify, request
from database import db
from models.atracao import Atracao

# Criamos o Blueprint para as atrações
atracoes_bp = Blueprint('atracoes', __name__)

# Rota de Listagem (GET)
@atracoes_bp.route('/atracoes', methods=['GET'])
def listar_atracoes():
    atracoes_banco = Atracao.query.all()
    lista_formatada = []
    for atracao in atracoes_banco:
        lista_formatada.append({
            "id": atracao.id,
            "nome": atracao.nome,
            "capacidade": atracao.capacidade,
            "status": atracao.status
        })
    return jsonify(lista_formatada), 200

# Rota de Cadastro (POST)
@atracoes_bp.route('/atracoes', methods=['POST'])
def cadastrar_atracao():
    dados = request.get_json()
    if not dados or 'nome' not in dados or 'capacidade' not in dados:
        return jsonify({"erro": "Dados incompletos."}), 400
    
    nova_atracao = Atracao(
        nome=dados['nome'],
        capacidade=dados['capacidade'],
        status=dados.get('status', 'Ativo')
    )
    db.session.add(nova_atracao)
    db.session.commit()
    
    return jsonify({"mensagem": "Atração cadastrada com sucesso!", "id": nova_atracao.id}), 201

# 3. Rota de atualização (MÉTODO HTTP PUT)
@atracoes_bp.route('/atracoes/<int:id>', methods=['PUT'])
def atualizar_atracao(id):
    # Busca a atração pelo ID fornecido na URL
    atracao = Atracao.query.get(id)
    
    if not atracao:
        return jsonify({"erro": "Atração não encontrada."}), 404
        
    dados = request.get_json()
    
    # Atualiza os campos se eles existirem no JSON recebido
    atracao.nome = dados.get('nome', atracao.nome)
    atracao.capacidade = dados.get('capacidade', atracao.capacidade)
    atracao.status = dados.get('status', atracao.status)
    
    # Salva as alterações no banco
    db.session.commit()
    
    return jsonify({"mensagem": f"Atração ID {id} atualizada com sucesso!"}), 200

# 4. Rota de exclusão (MÉTODO HTTP DELETE)
@atracoes_bp.route('/atracoes/<int:id>', methods=['DELETE'])
def deletar_atracao(id):
    # Busca a atração pelo ID
    atracao = Atracao.query.get(id)
    
    if not atracao:
        return jsonify({"erro": "Atração não encontrada."}), 404
        
    # Remove do banco
    db.session.delete(atracao)
    db.session.commit()
    
    return jsonify({"mensagem": f"Atração ID {id} removida com sucesso!"}), 200