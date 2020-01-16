from flask import Flask

from src import environment
from src.addons import ma, api
from src.database import create_db

def create_app():
    app = Flask(__name__)
    app.config.from_object(environment)

    create_db(app)
    ma.init_app(app)
    api.init_app(app)

    return app