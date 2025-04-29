from flask import Blueprint, render_template, request, redirect, url_for
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
    nome = request.form.get('nome')
    preco = request.form.get('preco')
    if nome and preco:
        novo_brinquedo = Brinquedo(nome=nome, preco=float(preco))
        db.session.add(novo_brinquedo)
        db.session.commit()
    return redirect(url_for('brinquedo.ver_brinquedos'))
