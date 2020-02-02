from flask import request
from flask_jwt_extended import create_access_token, decode_token
from ..database import User
from ..schemas import UserSchema
from ._dao import DAO

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
    def get_token_resource(cls):
        if (request.json and request.json.get('email') and request.json.get('password')):
            user = cls.login(request.json['email'], request.json['password'])
            if user is None:
                return {"message": "Bad credentials."}, 401
        elif request.headers.get('Authorization'):
            auth_header = request.headers['Authorization']
            if not auth_header.startswith('Bearer '):
                return 'Invalid token type. Please provide Bearer token.'
            user = cls.user_from_token(auth_header[7:])
        else:
            return {
                "message": "Can't verify your identity. Please either provider (email/password) or Bearer token"
            }, 400

        if not user:
            return {"message": "We are unable to determine your identity from token."}, 404
        
        return cls.get_token(user)
    
    @classmethod
    def get_token(cls, user):
        access_token = create_access_token(identity=user)
        return {'access_token': access_token}

