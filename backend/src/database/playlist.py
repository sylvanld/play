from ..addons import db

association_table = db.Table('association_playlist_tracks', db.Model.metadata,
    db.Column('playlist_id', db.Integer, db.ForeignKey('playlist.id')),
    db.Column('track_isrc', db.Integer, db.ForeignKey('track.isrc'))
)

class Playlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.ForeignKey('user.id'))
    title = db.Column(db.String)
    tracks = db.relationship('Track', secondary=association_table)
