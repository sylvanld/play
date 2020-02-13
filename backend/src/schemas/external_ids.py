from ..addons import ma
from ..database import ExternalIds

class ExternalIdsSchema(ma.ModelSchema):
    class Meta:
        fields = ('isrc', 'spotify', 'youtube', 'deezer')
        model = ExternalIds