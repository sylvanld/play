from flask import request
from flask_restplus import Namespace, Resource
from ..dao.user import UserDAO

from src.authentication.spotify import Spotify
from src.authentication.deezer import Deezer

auth_ns = Namespace('auth', 'third-party (spotify, deezer) oauth and play authentication methods', path='/')


@auth_ns.route('/auth/token')
class TokenResource(Resource):
    @auth_ns.expect()
    def post(self):
        """
        Return play access token
        """
        return UserDAO.get_token_resource()
        
        

@auth_ns.route('/auth/spotify')
class SpotifyAuthRequired(Resource):
    def get(self):
        return Spotify.require_authorization()

@auth_ns.route('/auth/deezer')
class SpotifyAuthRequired(Resource):
    def get(self):
        return Deezer.require_authorization()

@auth_ns.route('/authorized/spotify')
class SpotifyAuthHandler(Resource):
    def get(self):
        return Spotify.handle_authorization(request.args['code'])

@auth_ns.route('/authorized/deezer')
class DeezerAuthHandler(Resource):
    def get(self):
        return Deezer.handle_authorization(request.args['code'])
