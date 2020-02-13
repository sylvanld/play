from marshmallow import fields, Schema
from ..addons import ma
from ..database import Track


class ExternalIdsSchema(Schema):
    youtube = fields.String()
    deezer = fields.String()
    spotify = fields.String()

class TrackSchema(ma.ModelSchema):
    
    class Meta:
        fields = ('isrc', 'title', 'album', 'artists', 'external_ids')
        dump_only = ('id')
        model = Track


    def _serialize(self, track, **kwargs):
        data = super(TrackSchema, self)._serialize(track, **kwargs)
        data['external_ids'] = {
            'youtube': data.pop('youtube'),
            'deezer': data.pop('deezer'),
            'spotify': data.pop('spotify')
        }
        return data

    def _deserialize(self, data, **kwargs):
        data['youtube'] = data['external_ids'].get('youtube')
        data['spotify'] = data['external_ids'].get('spotify')
        data['deezer'] = data['external_ids'].get('deezer')
        return data