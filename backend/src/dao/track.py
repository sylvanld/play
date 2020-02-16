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
    def get_or_create(cls, track_data={}, commit=True):
        if not track_data.get('isrc'):
            raise HttpError("No ISRC => fuck u", 400)

        existings = cls.filter(Track.isrc == track_data['isrc'])

        instance = existings[0] if len(existings) > 0 else None

        if not instance:
            instance = cls.create(track_data, commit=commit)
        else:
            cls.add_externals_ids(
                instance,
                youtube=track_data.get('youtube'),
                deezer=track_data.get('deezer'),
                spotify=track_data.get('spotify')
            )

        return instance


    @classmethod
    def create_all(cls, tracks_data):
        tracks = []
        for track_data in (tracks_data or []):
            tracks.append( cls.get_or_create(track_data, commit=False) )
        db.session.commit()
        return tracks