from ..addons import db

class ExternalIds(db.Model):
    isrc = db.Column(db.String, db.ForeignKey('track.isrc'), primary_key=True)
    
    youtube = db.Column(db.String, unique=True)
    spotify = db.Column(db.String, unique=True)
    deezer = db.Column(db.Integer, unique=True)
