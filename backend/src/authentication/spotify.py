import requests
from flask import redirect, request
from urllib.parse import urlencode

from src.authentication._provider import IdentityProvider
from src.environment import (
    SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI, SPOTIFY_PERMISSIONS)


class Spotify(IdentityProvider):
    @classmethod
    def require_authorization(cls):
        state = {'state': request.args['token']} if request.args.get('token') else {}
        # redirect end-user on authorization page
        return redirect('https://accounts.spotify.com/authorize?' + urlencode({
            'client_id': SPOTIFY_CLIENT_ID,
            'response_type': 'code',
            'redirect_uri': SPOTIFY_REDIRECT_URI,
            'scope': ' '.join(SPOTIFY_PERMISSIONS),
            **state
        }))

    @classmethod
    def get_token(cls, authorization_code):
        # exchange authorization code for an access token
        response = requests.post('https://accounts.spotify.com/api/token', data={
            'grant_type': 'authorization_code',
            'code': authorization_code,
            'redirect_uri': SPOTIFY_REDIRECT_URI,
            'client_id': SPOTIFY_CLIENT_ID,
            'client_secret': SPOTIFY_CLIENT_SECRET
        })

        # make sure that we got a valid response from token endpoint
        assert response.status_code == 200
        access_token = response.json()['access_token']
        
        return access_token

    @classmethod
    def get_identity(cls, access_token):
        # get current user identity from access_token
        response = requests.get('https://api.spotify.com/v1/me', headers={
            'Authorization': 'Bearer ' + access_token
        })

        # make sure that we got a valid response from id endpoint
        assert response.status_code == 200
        user_info = response.json()

        return {
            'external_id': user_info['id'],
            'provider': 'SPOTIFY',
            'name': user_info['display_name'].title(),
            'lang': user_info['country'],
            'email': user_info['email']
        }

