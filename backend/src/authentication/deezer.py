import requests
from urllib.parse import urlencode
from flask import redirect, request

from src.authentication._provider import IdentityProvider
from src.environment import (
    DEEZER_CLIENT_ID, DEEZER_CLIENT_SECRET, DEEZER_PERMISSIONS, PLAY_AUTHORIZED_URI)

DEEZER_REDIRECT_URI = PLAY_AUTHORIZED_URI + '/deezer'

class Deezer(IdentityProvider):
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
    def get_token(cls, authorization_code):
        # exchange authorization code for an access token
        response = requests.post('https://connect.deezer.com/oauth/access_token.php?' + urlencode({
            'app_id': DEEZER_CLIENT_ID,
            'secret': DEEZER_CLIENT_SECRET,
            'code': authorization_code,
            'output': 'json'
        }))

        # make sure that we got a valid response from token endpoint
        assert response.status_code == 200
        access_token = response.json()['access_token']
        return access_token
        
    @classmethod
    def get_identity(cls, access_token):
        # get current user identity from access_token
        response = requests.get('https://api.deezer.com/user/me?access_token=' + access_token)
    
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
