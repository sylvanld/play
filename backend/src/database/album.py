from ..addons import db

class Album(db.Model):
    id = db.Column(db.Integer, primary_key=True)
