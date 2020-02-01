from src.addons import db
import enum


class Provider(enum.Enum):
    PLAY = "PLAY"
    DEEZER = "DEEZER"
    SPOTIFY = "SPOTIFY"


class Account(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.ForeignKey('user.id'))

    external_id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String)
    provider = db.Column(db.Enum(Provider))
    code = db.Column(db.String)
