from ._dao import DAO, db
from .track import TrackDAO
from ..database import Playlist, association_playlist_tracks
from ..schemas import PlaylistSchema

class PlaylistDAO(DAO):
    model = Playlist
    schemas = {
        'default': PlaylistSchema
    }

    @classmethod
    def add_tracks(cls, playlist_id, tracks_data):
        playlist = cls.get_or_404(playlist_id)
        tracks = TrackDAO.create_all(tracks_data)
        print(tracks)

        playlist.tracks.extend(tracks)
        db.session.commit()

        return tracks
