from src.addons import db
import enum


class Provider(enum.Enum):
    PLAY = "PLAY"
    DEEZER = "DEEZER"
    SPOTIFY = "SPOTIFY"


class Account(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.ForeignKey('user.id'))

    name = db.Column(db.String)
    external_id = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False)
    provider = db.Column(db.Enum(Provider), nullable=False)
    code = db.Column(db.String)
