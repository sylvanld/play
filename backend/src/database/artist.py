from ..addons import db

class Artist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    