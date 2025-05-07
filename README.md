# Projeto MVC

Este é um projeto de site utilizando a arquitetura **MVC (Model-View-Controller)**, desenvolvido com **Python** e **Flask**. O objetivo é aplicar os conceitos de separação de responsabilidades, facilitando a manutenção e escalabilidade da aplicação. Esse projeto foi desenvolvimento para o trabalho da faculdade de ADS, campus Pedro II. Um site simples de uma loja de briquendos, onde é possivel cadastrar tanto o brinquedo e o cliente, também é possivel realizar o CRUD.

---

## 📁 Estrutura do Projeto

- `app.py`: Arquivo principal que inicia a aplicação Flask.
- `config.py`: Configurações da aplicação, como conexões e variáveis de ambiente.
- `extensions.py`: Inicialização de extensões utilizadas no projeto.
- `controllers/`: Contém os controladores que lidam com as requisições e respostas.
- `models/`: Modelos que representam as entidades e interagem com o banco de dados.
- `templates/`: Arquivos HTML que compõem a camada de visualização.
- `static/`: Arquivos estáticos como CSS, JavaScript e imagens.
- `db.sqlite3`: Banco de dados SQLite utilizado para armazenar os dados da aplicação.
- `requirements.txt`: Lista de dependências necessárias para executar o projeto.

---

## 🚀 Tecnologias Utilizadas

- Python 3  
- Flask  
- SQLite  
- HTML  
- CSS  
- JavaScript
- Json

---

## ⚙️ Instalação e Execução

1. Clone o repositório:

```bash
git clone https://github.com/SwagMessiah02/projeto_mvc.git
```

2. Acesse o diretório do projeto:

```bash
cd projeto_mvc
```

3. Crie um ambiente virtual (opcional, mas recomendado):

```bash
# Para Linux/macOS:
python -m venv venv
source venv/bin/activate

# Para Windows:
python -m venv venv
venv\Scripts\activate
```

4. Instale as dependências:

```bash
pip install -r requirements.txt
```

5. Execute a aplicação:

```bash
python app.py
```

---

Sinta-se à vontade para contribuir com melhorias ou sugestões!
