from sqlalchemy import or_
from ._dao import DAO, db
from ..database import Track
from ..schemas import TrackSchema
from ..exceptions import HttpError

class TrackDAO(DAO):
    model = Track
    schemas = {
        'default': TrackSchema
    }


    @classmethod
    def add_externals_ids(cls, track, youtube=None, deezer=None, spotify=None):
        change = False

        if youtube and youtube != track.youtube:
            track.youtube = youtube
            change = True

        if deezer and deezer != track.deezer:
            track.deezer = deezer
            change = True

        if spotify and spotify != track.spotify:
            track.spotify = spotify
            change = True

        if change:
            db.session.commit()



    @classmethod
    def get_create_or_update(cls, track_data):
        existings = cls.filter(
            or_(
                Track.isrc == track_data['isrc'],
                Track.youtube == track_data['youtube'],
                Track.spotify == track_data['spotify'],
                Track.deezer == track_data['deezer'],
            )
        )

        instance = existings[0] if len(existings) > 0 else None

        if not instance:
            instance = cls.create(track_data)
        else:
            cls.add_externals_ids(
                instance,
                youtube=track_data['youtube'],
                deezer=track_data['deezer'],
                spotify=track_data['spotify']
            )

        return instance


    @classmethod
    def create_all(cls, tracks_data):
        tracks = []
        for track_data in tracks_data:
            tracks.append( cls.get_create_or_update(track_data) )
        return tracks