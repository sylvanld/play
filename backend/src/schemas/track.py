from marshmallow import fields
from ..addons import ma
from ..database import Track
from .external_ids import ExternalIdsSchema


class TrackSchema(ma.ModelSchema):
    external_ids = fields.Nested(ExternalIdsSchema)
    
    class Meta:
        fields = ('isrc', 'title', 'album', 'artists', 'external_ids')
        dump_only = ('id')
        model = Track
