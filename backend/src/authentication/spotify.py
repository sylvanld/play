import requests, base64
from flask import redirect, request
from urllib.parse import urlencode

from src.database import Account
from src.authentication.provider import Provider
from src.environment import (
    SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_PERMISSIONS, PLAY_AUTHORIZED_URI)

SPOTIFY_REDIRECT_URI = PLAY_AUTHORIZED_URI + '/spotify'

class Spotify(Provider):
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
    def get_application_token(cls):
        auth_header = 'Basic ' + base64.b64encode(
            f'{SPOTIFY_CLIENT_ID}:{SPOTIFY_CLIENT_SECRET}'.encode('utf-8')
        ).decode('utf-8')

        # either use refresh token
        response = requests.post('https://accounts.spotify.com/api/token', data={
            'grant_type': 'client_credentials',
        }, headers={'Authorization': auth_header})
       
        assert response.status_code == 200
        # TODO: store new refresh token
        return {'access_token': response.json()['access_token']}


    @classmethod
    def get_token_for_user(cls, user):
        account = Account.query.filter_by(user_id=user.id, provider='SPOTIFY').first()

        auth_header = 'Basic ' + base64.b64encode(
            f'{SPOTIFY_CLIENT_ID}:{SPOTIFY_CLIENT_SECRET}'.encode('utf-8')
        ).decode('utf-8')

        # either use refresh token
        response = requests.post('https://accounts.spotify.com/api/token', data={
            'grant_type': 'refresh_token',
            'refresh_token': account.refresh_token
        }, headers={'Authorization': auth_header})
       
        assert response.status_code == 200
        # TODO: store new refresh token
        return {'access_token': response.json()['access_token']}


    @classmethod
    def get_token_from_code(cls, code):
        # exchange authorization code for an access token
        response = requests.post('https://accounts.spotify.com/api/token', data={
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': SPOTIFY_REDIRECT_URI,
            'client_id': SPOTIFY_CLIENT_ID,
            'client_secret': SPOTIFY_CLIENT_SECRET
        })

        # make sure that we got a valid response from token endpoint
        assert response.status_code == 200
<<<<<<< HEAD
        access_token = response.json()['access_token']
        print("my token is {} --end".format(access_token))
        return access_token
=======

        data = response.json()
        return {
            'access_token': data['access_token'],
            'expires': data['expires_in'],
            'refresh_token': data['refresh_token']
        }

>>>>>>> b6711e8ab22b700d02a1241f135618faeb6e8770

    @classmethod
    def get_identity_from_token(cls, user_access_token):
        # get current user identity from access_token
        response = requests.get('https://api.spotify.com/v1/me', headers={
            'Authorization': 'Bearer ' + user_access_token
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
