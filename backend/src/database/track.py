from ..addons import db

class Track(db.Model):
    id      = db.Column(db.Integer, primary_key=True)
    
    isrc    = db.Column(db.String, unique=True)
    title   = db.Column(db.String)
    artists = db.Column(db.String)
    album   = db.Column(db.String)
    release = db.Column(db.DateTime)

    youtube = db.Column(db.String, nullable=True)
    spotify = db.Column(db.String, nullable=True)
    deezer  = db.Column(db.Integer, nullable=True)
