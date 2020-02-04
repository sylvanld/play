from ..addons import ma
from ..database import Friendship

class FriendshipSchema(ma.ModelSchema):
    class Meta:
        fields = ('id', 'friend_id', 'friend1', 'friend2', 'accepted')
        load_only = ('friend1', 'friend2')
        dump_only = ('id', 'accepted', 'friend_id')
        model = Friendship
