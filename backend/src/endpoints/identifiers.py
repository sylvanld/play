from flask import request
from flask_restplus import Namespace, Resource


auth_ns = Namespace('auth', 'third-party (spotify, deezer) oauth and play authentication methods', path='/')
auth_bp = Blueprint('auth', __name__)
