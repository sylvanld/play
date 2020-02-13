from ._dao import DAO
from ..database import Track
from ..schemas import TrackSchema

class TrackDAO(DAO):
    model = Track
    schemas = {
        'default': TrackSchema
    }
    