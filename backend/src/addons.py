from flask_restplus import Api
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS

api = Api()
db = SQLAlchemy()
ma = Marshmallow()
cors = CORS()
