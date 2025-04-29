from flask import Blueprint, render_template, request, redirect, url_for
from models.usuario import Usuario
from extensions import db

usuario_bp = Blueprint('usuario', __name__)

@usuario_bp.route('/usuarios')
def cadastro_usuario():
    return render_template('usuarios.html')

@usuario_bp.route('/ver_usuarios')
def ver_usuarios():
    usuarios = Usuario.query.all()
    return render_template('ver_usuarios.html', usuarios=usuarios)

@usuario_bp.route('/usuarios', methods=['POST'])
def salvar_usuario():
    nome = request.form.get('nome')
    email = request.form.get('email')
    if nome and email:
        novo_usuario = Usuario(nome=nome, email=email)
        db.session.add(novo_usuario)
        db.session.commit()
    return redirect(url_for('usuario.ver_usuarios'))
