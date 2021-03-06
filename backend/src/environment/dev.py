
JWT_ACCESS_TOKEN_EXPIRES = 3600
JWT_REFRESH_TOKEN_EXPIRES = 2592000

# play own configuration
PLAY_AUTHORIZED_URI = 'http://localhost:8080/authorized'
PLAY_FRONTEND_URI   = 'http://localhost:4200'

# spotify oauth2 configuration
SPOTIFY_CLIENT_ID = '4542a547217f4000b71e8fbfbe090793'
SPOTIFY_CLIENT_SECRET = 'a39aa0f6ab32449ab96e2715a9570bd4'
SPOTIFY_PERMISSIONS = [
    'user-read-email',
    'user-read-private',
    'playlist-modify',
    'playlist-modify-private',
    'playlist-read-private',      # manage playlists
    'playlist-read-collaborative' # manage playlists
]

# deezer oauth2 configuration
DEEZER_CLIENT_ID = '388924'
DEEZER_CLIENT_SECRET = '342ad744c8bf0e09677c638ee9b5c0ca'
DEEZER_PERMISSIONS = [
    'basic_access',
    'email',
    'offline_access', # required to access refresh_token
    'manage_library'  # manage playlists
]

# server database configuration
SQLALCHEMY_DATABASE_URI         = 'sqlite:///:memory:'
# SQLALCHEMY_DATABASE_URI         = 'sqlite:///database.sqlite'
SQLALCHEMY_TRACK_MODIFICATIONS  = False

# required to hash multiple trucs with salt
SECRET_KEY = 'jgirjuiogjeprijfierjiorvjiobjruiotjioj'