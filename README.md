# Play backend
## Configuration

### Paramètres spécifiques à l'application PLAY
|variable|detail|
|-|-|
|JWT_ACCESS_TOKEN_EXPIRES|Durée de vie d'un token play en secondes. 3600 par défaut.|
|JWT_REFRESH_TOKEN_EXPIRES|Durée de vie d'un refresh token play en secondes. 2592000 par défaut (= 1 mois). Cela signifie qu'un utilisateur peut rester connecté à son compte pendant 1 mois au maximum.|
|PLAY_FRONTEND_URI|Adresse de l'interface web de l'application (ex: https://play.io)|

### Paramètres pour l'utilisation de Spotify
|variable|detail|
|-|-|
|SPOTIFY_CLIENT_ID|Identifiant de l'application attribué par Spotify. https://developer.spotify.com/dashboard/applications|
|SPOTIFY_CLIENT_SECRET|Mot de passe de l'application attribué par Spotify. https://developer.spotify.com/dashboard/applications|
|SPOTIFY_PERMISSIONS|Liste des permissions requises par l'application dans Spotify.|

### Paramètres pour l'utilisation de Deezer
|variable|detail|
|-|-|
|DEEZER_CLIENT_ID|Identifiant de l'application attribué par Deezer. https://developers.deezer.com/myapps|
|DEEZER_CLIENT_SECRET|Mot de passe de l'application attribué par Deezer. https://developers.deezer.com/myapps|
|DEEZER_PERMISSIONS|Liste des permissions requises par l'application dans Deezer.|


|SQLALCHEMY_DATABASE_URI|URI de la base de données utilisée par l'application Play. Peut être configuré|
SQLALCHEMY_TRACK_MODIFICATIONS  = False

# required to hash multiple trucs with salt
SECRET_KEY = 'jgirjuiogjeprijfierjiorvjiobjruiotjioj'

## TODO: Pistes d'amélioration

- définir des tags (avec icones <3) et tagger les playlists (comme emails dans GMail)
- partager des playlists aux amis (à un instant t / en mode collaboratif)
- utiliser plusieurs players
- conserver le lien `playlist_importée/plateforme` pour pouvoir actualiser (pull/push)
- partage via les réseaux sociaux
- autocompléter la liste de lecture en arrivant à la fin si on ne boucle pas
- gerer un historique des recherches
- gerer un historique reversible des actions (imports / exports / creation / suppression)