from ..addons import db

class Track(db.Model):
    isrc = db.Column(db.String, primary_key=True)
    
    title = db.Column(db.String)
    artists = db.Column(db.String)
    albums = db.Column(db.String)
    release = db.Column(db.DateTime)
