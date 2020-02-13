import requests

base_url = 'http://localhost:8080'

# recupere un token play
r = requests.post(base_url + '/play/token', json={
    'email': 'sledeunf@gmail.com', # A changer
    'password': 'toto' # A changer
})

assert r.status_code == 200
access_token = r.json()['access_token']


# utilise le token play pour recuperer un token spotify
r = requests.post(
    base_url + '/spotify/token/me',
    headers={
        'Authorization': 'Bearer ' + access_token
    }
)

assert r.status_code == 200
spotify_access_token = r.json()

# TODO: utiliser l'access token