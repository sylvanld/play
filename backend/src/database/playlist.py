from ..addons import db

class Playlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.ForeignKey('user.id'))
    title = db.Column(db.String)
