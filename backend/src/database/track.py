from ..addons import db

class Track(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    release = db.Column(db.DateTime)
