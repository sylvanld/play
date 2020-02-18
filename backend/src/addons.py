from flask_restplus import Api
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager

api = Api()
db = SQLAlchemy()
ma = Marshmallow()
cors = CORS()
bcrypt = Bcrypt()
jwt = JWTManager()

jwt._set_error_handler_callbacks(api)
