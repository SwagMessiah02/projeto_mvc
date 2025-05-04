from flask import Blueprint, render_template, jsonify, request, redirect, url_for
from models.usuario import Usuario
from extensions import db

usuario_bp = Blueprint('usuario', __name__)

@usuario_bp.route('/usuarios', methods=['GET'])
def cadastro_usuario():
    return render_template('usuarios.html')

@usuario_bp.route('/ver_usuarios', methods=['GET'])
def ver_usuarios():
    usuarios = Usuario.query.all()
    return render_template('ver_usuarios.html', usuarios=usuarios)

@usuario_bp.route('/usuarios', methods=['POST'])
def salvar_usuario():
    data = request.get_json()
    nome = data.get('nome')
    data_email = request.get_json()
    email = data_email.get('email')
    if nome and email:
        novo_usuario = Usuario(nome=nome, email=email)
        db.session.add(novo_usuario)
        db.session.commit()
    return redirect(url_for('usuario.ver_usuarios'))

@usuario_bp.route('/get_usuarios', methods=['GET'])
def get_usuarios():
    usuarios = Usuario.query.all()

    users = [{
        'id': u.id,
        'nome': u.nome,
        'email': u.email
    } for u in usuarios]

    return jsonify(users)

@usuario_bp.route('/remover_usuario', methods=['DELETE'])
def remover_usuario():
    data_nome = request.get_json()
    nome = data_nome.get('nome') 
    usuario = Usuario.query.filter_by(nome=nome).first()

    if not nome:
        return jsonify({'erro': 'Nome não fornecido'}), 400

    if not usuario:
        return jsonify({'erro': 'Usuário não encontrado'}), 404

    db.session.delete(usuario) 
    db.session.commit()

    return jsonify({'mensagem': f'Usuário {nome} removido com sucesso'}), 500

@usuario_bp.route('/atualizar_usuario', methods=['PUT'])
def atualizar_user():
    data = request.get_json()

    nome = data.get('nome') 
    nome_editado = data.get('nome_editado')
    email_editado = data.get('email_editado')

    if not nome:
        return jsonify({'erro': 'Nome não fornecido'}), 400
    
    usuario = Usuario.query.filter_by(nome=nome).first()

    if not usuario:
        return jsonify({'erro': 'Usuário não encontrado'}), 404
    
    usuario.nome = nome_editado
    usuario.email = email_editado
    
    db.session.commit()

    return jsonify({'mensagem': f'Usuário {nome} atualizado com sucesso'})