from flask import request
from datetime import timedelta
from flask_jwt_extended import create_access_token, create_refresh_token, decode_token

from src.database import User
from src.schemas import UserSchema
from src.dao._dao import DAO
from src.environment import JWT_ACCESS_TOKEN_EXPIRES

class UserDAO(DAO):
    model = User
    schemas = {
        'default': UserSchema
    }

    @classmethod
    def login(cls, email, password):
        user = User.query.filter_by(email=email).first()

        if user is None:
            return None

        return user if user.check_password(password) else None


    @classmethod
    def user_from_token(cls, bearer_token):
        identity = decode_token(bearer_token)['identity']
        return User.query.filter_by(id=identity).first()

    
    @classmethod
    def get_token(cls, user):
        return {
            'access_token': create_access_token(identity=user),
            'refresh_token': create_refresh_token(identity=user),
            'expires': JWT_ACCESS_TOKEN_EXPIRES
        }

