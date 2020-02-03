# play own configuration
PLAY_AUTHORIZED_URI = 'https://api.play.sylvan.ovh/authorized'
PLAY_FRONTEND_URI   = 'http://play.sylvan.ovh'

# server database configuration
SQLALCHEMY_DATABASE_URI         = 'sqlite:///:memory:'
SQLALCHEMY_TRACK_MODIFICATIONS  = False

# required to hash multiple trucs with salt
SECRET_KEY = 'fer48g4er84564faz478rg4re8'
