from flask import request, Blueprint
from flask_restplus import Namespace, Resource
from ..dao.user import UserDAO

from src.authentication.spotify import Spotify
from src.authentication.deezer import Deezer

auth_ns = Namespace('auth', 'third-party (spotify, deezer) oauth and play authentication methods', path='/')
auth_bp = Blueprint('auth', __name__)


# get token for desired provider


@auth_ns.route('/play/token')
class TokenResource(Resource):
    @auth_ns.expect()
    def post(self):
        """
        Return play access token
        """
        return UserDAO.get_token_resource()


@auth_ns.route('/spotify/token')
class TokenResource(Resource):
    @auth_ns.expect()
    def get(self):
        """
        Return spotify application access token
        """
        return Spotify.get_generic_token()


@auth_ns.route('/deezer/token')
class TokenResource(Resource):
    @auth_ns.expect()
    def get(self):
        """
        Return deezer application access token
        """
        raise NotImplementedError #Deezer.get_generic_token()



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
