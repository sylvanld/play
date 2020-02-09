from flask import Flask
from werkzeug.contrib.fixers import ProxyFix

from src import environment
from src.addons import ma, api, cors, bcrypt, jwt
from src.database import create_db
from src.endpoints import create_endpoints
from src.authentication.play import configure_jwt
from src.exceptions import HttpError

def create_app():
    """
    Create Flask application and initialize addons.
    """
    app = Flask(__name__)
    app.wsgi_app = ProxyFix(app.wsgi_app)
    app.config.from_object(environment)

    @app.errorhandler(HttpError)
    def error_handler(error: HttpError):
        return error.make_response()

    create_db(app)
    create_endpoints(app, api)
    configure_jwt(jwt)

    ma.init_app(app)
    api.init_app(app)
    cors.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    return app