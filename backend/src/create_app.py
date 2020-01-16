from flask import Flask

from src import environment
from src.addons import db, ma, api

def create_app():
    app = Flask(__name__)
    app.config.from_object(environment)

    db.init_app(app)
    ma.init_app(app)
    api.init_app(app)

    return app