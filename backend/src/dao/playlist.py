from ._dao import DAO, db
from .track import TrackDAO
from ..database import Playlist, PlaylistTrack
from ..schemas import PlaylistSchema, PlaylistSimpleSchema

class PlaylistDAO(DAO):
    model = Playlist
    schemas = {
        'default': PlaylistSimpleSchema,
        'full': PlaylistSchema
    }

    @classmethod
    def add_tracks(cls, playlist_id, tracks_data):
        """
        Add tracks to this playlist
        """
        playlist = cls.get_or_404(playlist_id)
        tracks = TrackDAO.create_all(tracks_data)
        
        db.session.add_all(
            [PlaylistTrack(track=track, playlist_id=playlist_id) for track in tracks]
        )
        db.session.commit()

        print('after add tracks', playlist.tracks)

        return playlist.tracks

    @classmethod
    def drop_tracks(cls, playlist_id):
        """
        Drop all tracks contains in this playlist
        """
        PlaylistTrack.query.filter_by(playlist_id=playlist_id).delete()
        db.session.commit()


    @classmethod
    def update_tracks(cls, playlist_id, tracks_data):
        """
        Replace track of playlist with those contained in tracks data
        """
        cls.drop_tracks(playlist_id)
        tracks = cls.add_tracks(playlist_id, tracks_data)
        print([track.title for track in tracks])
        return tracks
