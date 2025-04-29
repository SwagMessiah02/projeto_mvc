from flask import Flask, render_template
from config import Config
from extensions import db
from controllers.usuario_controller import usuario_bp
from controllers.brinquedo_controller import brinquedo_bp

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

with app.app_context():
    from models.usuario import Usuario
    from models.brinquedo import Brinquedo
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

app.register_blueprint(usuario_bp)
app.register_blueprint(brinquedo_bp)

if __name__ == '__main__':
    PORT = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=PORT)
