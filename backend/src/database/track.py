from ..addons import db

class Track(db.Model):
    isrc    = db.Column(db.String, primary_key=True)
    title   = db.Column(db.String)
    artists = db.Column(db.String)
    album   = db.Column(db.String)
    release = db.Column(db.DateTime)

    youtube = db.Column(db.String, nullable=False)
    spotify = db.Column(db.String, nullable=False)
    deezer  = db.Column(db.Integer, nullable=False)
