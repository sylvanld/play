from marshmallow import fields
from ..addons import ma
from ..database import Playlist
from .track import TrackSchema

class PlaylistSimpleSchema(ma.ModelSchema):    
    class Meta:
        model = Playlist
        fields = ('id', 'title', 'owner_id')
        dump_only = ('id',)


class PlaylistSchema(ma.ModelSchema):
    tracks = fields.List(fields.Nested(TrackSchema))
    
    class Meta:
        model = Playlist
        fields = ('id', 'title', 'owner_id', 'tracks')
        dump_only = ('id',)
