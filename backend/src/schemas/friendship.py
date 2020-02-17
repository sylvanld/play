from marshmallow import fields
from ..addons import ma
from ..database import Friendship
from .users import UserSchema


class FriendshipSchema(ma.ModelSchema):

    friend = fields.Nested(UserSchema)

    class Meta:
        fields = ('id', 'friend1_id', 'friend2_id', 'friend', 'accepted')
        dump_only = ('id', 'friend')
        load_only = ('friend1_id', 'friend2_id')
        model = Friendship
