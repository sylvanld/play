from flask import request, Blueprint
from flask_restplus import Namespace, Resource
from flask_jwt_extended import jwt_required, current_user
from ..dao.user import UserDAO

from src.authentication.spotify import Spotify
from src.authentication.deezer import Deezer


auth_ns = Namespace('auth', 'third-party (spotify, deezer) oauth and play authentication methods', path='/')
auth_bp = Blueprint('auth', __name__)


# get token for desired provider


@auth_ns.route('/play/token')
class TokenResource(Resource):
    def post(self):
        """
        Return play access token
        """
        if (request.json and request.json.get('email') and request.json.get('password')):
            user = UserDAO.login(request.json['email'], request.json['password'])
            if user is None:
                return {"message": "Bad credentials."}, 401
            
        elif request.headers.get('Authorization'):
            auth_header = request.headers['Authorization']

            if not auth_header.startswith('Bearer '):
                return 'Invalid token type. Please provide Bearer token.'

            user = UserDAO.user_from_token(auth_header[7:])
            if user is None:
                return {"message": "We are unable to determine your identity from token."}, 401

        else:
            return {
                "message": "Can't verify your identity. Please either provider (email/password) or Bearer token"
            }, 401

        return UserDAO.get_token(user)



@auth_ns.route('/spotify/token')
class SpotifyTokenResource(Resource):
    @jwt_required
    def post(self):
        """
        Return spotify application access token
        """
        print('wesh user', current_user)
        return Spotify.get_application_token()


@auth_ns.route('/spotify/token/me')
class SpotifyUserTokenResource(Resource):
    @jwt_required
    def post(self):
        """
        return user token
        """
        return Spotify.get_token_for_user(user)


@auth_ns.route('/deezer/token/me')
class SpotifyTokenResource(Resource):
    @jwt_required
    def post(self):
        """
        Return deezer application access token
        """
        raise Deezer.get_token(current_user)



# Third party authorization follow

@auth_bp.route('/auth/spotify')
def require_spotify_authorization():
    return Spotify.require_authorization()
    


@auth_bp.route('/auth/deezer')
def require_deezer_authorization():
    return Deezer.require_authorization()


@auth_bp.route('/authorized/spotify')
def handle_spotify_authorization():
    return Spotify.handle_authorization(request.args['code'])


@auth_bp.route('/authorized/deezer')
def handle_deezer_authorization():
    return Deezer.handle_authorization(request.args['code'])
