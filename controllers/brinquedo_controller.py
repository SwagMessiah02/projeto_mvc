from flask import Blueprint, render_template, request, jsonify, redirect, url_for
from models.brinquedo import Brinquedo
from extensions import db

brinquedo_bp = Blueprint('brinquedo', __name__)

@brinquedo_bp.route('/brinquedos')
def cadastro_brinquedo():
    return render_template('brinquedos.html')

@brinquedo_bp.route('/ver_brinquedos')
def ver_brinquedos():
    brinquedos = Brinquedo.query.all()
    return render_template('ver_brinquedos.html', brinquedos=brinquedos)

@brinquedo_bp.route('/brinquedos', methods=['POST'])
def salvar_brinquedo():
    data_name = request.get_json()
    nome = data_name.get('nome') 
    data_preco = request.get_json()
    preco = data_preco.get('preco')
    if nome and preco:
        novo_brinquedo = Brinquedo(nome=nome, preco=float(preco))
        db.session.add(novo_brinquedo)
        db.session.commit()
    return redirect(url_for('brinquedo.ver_brinquedos'))

@brinquedo_bp.route('/get_brinquedos', methods=['GET'])
def get_brinquedos():
    brinquedos = Brinquedo.query.all()

    brinquedos_ = [{
        'id': b.id,
        'nome': b.nome,
        'preco': b.preco
    } for b in brinquedos]

    return jsonify(brinquedos_)

@brinquedo_bp.route('/remover_brinquedo', methods=['DELETE'])
def remover_brinquedo():
    data_nome = request.get_json()
    nome = data_nome.get('nome') 
    brinquedo = Brinquedo.query.filter_by(nome=nome).first()

    if not nome:
        return jsonify({'erro': 'Nome não fornecido'}), 400

    if not brinquedo:
        return jsonify({'erro': 'Brinquedo não encontrado'}), 404

    db.session.delete(brinquedo) 
    db.session.commit()

    return jsonify({'mensagem': f'Brinquedo {nome} removido com sucesso'}), 500

@brinquedo_bp.route('/atualizar_brinquedo', methods=['PUT'])
def atualizar_user():
    data = request.get_json()

    nome = data.get('nome') 
    nome_editado = data.get('nome_editado')
    preco_editado = data.get('preco_editado')

    if not nome:
        return jsonify({'erro': 'Nome não fornecido'}), 400
    
    brinquedo = Brinquedo.query.filter_by(nome=nome).first()

    if not brinquedo:
        return jsonify({'erro': 'Brinquedo não encontrado'}), 404
    
    brinquedo.nome = nome_editado
    brinquedo.preco = preco_editado
    
    db.session.commit()

    return jsonify({'mensagem': f'Brinquedo {nome} atualizado com sucesso'})