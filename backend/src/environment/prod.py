# play own configuration
PLAY_AUTHORIZED_URI = 'http://api.play.sylvan.ovh/authorized'
PLAY_FRONTEND_URI   = 'http://play.sylvan.ovh'

# deezer oauth2 configuration (dev and prod are differents apps)
DEEZER_CLIENT_ID = '393464'
DEEZER_CLIENT_SECRET = 'f027be88914c08fb12ede958958b6caf'

# server database configuration
SQLALCHEMY_DATABASE_URI         = 'sqlite:///:memory:'
SQLALCHEMY_TRACK_MODIFICATIONS  = False

# required to hash multiple trucs with salt
SECRET_KEY = 'fer48g4er84564faz478rg4re8'
