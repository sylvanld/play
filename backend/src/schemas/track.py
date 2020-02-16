from marshmallow import fields, Schema
from ..addons import ma
from ..database import Track



class TrackSchema(ma.ModelSchema):
    youtube = fields.String(required=False, allow_none=True)
    deezer = fields.Integer(required=False, allow_none=True)
    spotify = fields.String(required=True)

    class Meta:
        fields = ('isrc', 'title', 'album', 'artists', 'youtube', 'deezer', 'spotify', 'external_ids')
        dump_only = ('id', 'external_ids',)
        model = Track


    def _serialize_single(self, track, **kwargs):
        data = super(TrackSchema, self)._serialize(track, **kwargs)
        data['external_ids'] = {
            'youtube': data.pop('youtube', None),
            'deezer': data.pop('deezer', None),
            'spotify': data.pop('spotify', None)
        }
        return data

    def _serialize(self, track_or_tracks, many=False, **kwargs):
        if many:
            return [self._serialize_single(track, **kwargs) for track in track_or_tracks]
        else:
            return self._serialize_single(track_or_tracks, **kwargs)

    def _deserialize_single(self, data, **kwargs):
        # TODO: remove this useless method
        #print('deserializing 1', data)
        
        return super(TrackSchema, self)._deserialize(data, **kwargs)

    def _deserialize(self, data, many=False, **kwargs):
        #print('deserializing', data)
        if many:
            return [self._deserialize_single(row, **kwargs) for row in data]
        else:
            return self._deserialize_single(data, **kwargs)
