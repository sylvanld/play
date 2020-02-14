import requests
from urllib.parse import urlencode
from flask import redirect, request

from src.database import Account
from src.authentication.provider import Provider
from src.environment import (
    DEEZER_CLIENT_ID, DEEZER_CLIENT_SECRET, DEEZER_PERMISSIONS, PLAY_AUTHORIZED_URI)

DEEZER_REDIRECT_URI = PLAY_AUTHORIZED_URI + '/deezer'

class Deezer(Provider):
    @classmethod
    def require_authorization(cls):
        state = {'state': request.args['token']} if request.args.get('token') else {}
        # redirect end-user on authorization page
        return redirect('https://connect.deezer.com/oauth/auth.php?' + urlencode({
            'app_id': DEEZER_CLIENT_ID,
            'redirect_uri': DEEZER_REDIRECT_URI,
            'perms': ','.join(DEEZER_PERMISSIONS),
            **state
        }))

    @classmethod
    def get_token_for_user(cls, user):
        # Dans deezer, les tokens ont une duree de vie illimitee et pas de refresh token
        # La conception de l'oauth2 la plus WTF...
        account = Account.query.filter_by(user_id=user.id, provider='DEEZER').first()
        assert account is not None, "Pas de compte Deezer lié."
        return {'access_token': account.refresh_token}


    @classmethod
    def get_token_from_code(cls, code):
        # exchange authorization code for an access token
        response = requests.post('https://connect.deezer.com/oauth/access_token.php?' + urlencode({
            'app_id': DEEZER_CLIENT_ID,
            'secret': DEEZER_CLIENT_SECRET,
            'code': code,
            'output': 'json'
        }))

        # make sure that we got a valid response from token endpoint
        assert response.status_code == 200
        data = response.json()

        return {
            'access_token': data['access_token'], 
            'refresh_token': data['access_token'], 
            'expires': 0
        }
        
    @classmethod
    def get_identity_from_token(cls, user_access_token):
        # get current user identity from access_token
        response = requests.get('https://api.deezer.com/user/me?access_token=' + user_access_token)
    
        # make sure that we got a valid response from id endpoint
        assert response.status_code == 200
        user_info = response.json()

        return {
            'external_id': str(user_info['id']),
            'provider': 'DEEZER',
            'name': user_info['name'].title(),
            'lang': user_info['country'],
            'email': user_info['email']
        }
