from ._dao import DAO
from ..database import Playlist
from ..schemas import PlaylistSchema

class PlaylistDAO(DAO):
    model = Playlist
    schemas = {
        'default': PlaylistSchema
    }