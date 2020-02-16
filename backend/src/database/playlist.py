from ..addons import db


class PlaylistTrack(db.Model):
    __tablename__ = 'playlist_track'
    id          = db.Column(db.Integer, primary_key=True)
    playlist_id = db.Column(db.Integer, db.ForeignKey('playlist.id'))
    track_isrc  = db.Column(db.Integer, db.ForeignKey('track.isrc'))
    track       = db.relationship('Track')



class Playlist(db.Model):
    id          = db.Column(db.Integer, primary_key=True)
    owner_id    = db.Column(db.ForeignKey('user.id'))
    title       = db.Column(db.String)

    #tracks      = db.relationship('Track', secondary='playlist_track')
    @property
    def tracks(self):
        return [
            pt.track for pt in PlaylistTrack.query.filter_by(playlist_id=self.id).all()
        ]

    @tracks.setter
    def tracks(self, tracks):
        PlaylistTrack.query.filter_by(playlist_id=self.id).delete()
        db.session.add_all([
            PlaylistTrack(playlist_id=self.id, track=track)
            for track in tracks
        ])
        db.session.commit()
