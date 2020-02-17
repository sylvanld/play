from sqlalchemy import or_

from ._dao import DAO
from ..database import Friendship
from ..schemas import FriendshipSchema


class FriendshipDAO(DAO):
    model = Friendship
    schemas = {
        'default': FriendshipSchema
    }

    @classmethod
    def friends_for_user(cls, user_id):
        return cls.workout_friend_property(
            user_id,
            cls.filter(
                or_(
                    Friendship.friend1_id == user_id,
                    Friendship.friend2_id == user_id
                ),
                Friendship.accepted == True
            )
        )

    @classmethod
    def friends_requests_incoming_for_user(cls, user_id):
        return cls.workout_friend_property(
            user_id,
            cls.filter(
                Friendship.friend2_id == user_id,
                Friendship.accepted == False
            )
        )

    @classmethod
    def friends_requests_outgoing_for_user(cls, user_id):
        return cls.workout_friend_property(
            user_id,
            cls.filter(
                Friendship.friend1_id == user_id,
                Friendship.accepted == False
            )
        )

    @classmethod
    def workout_friend_property(cls, user_id, friendships):
        for friendship in friendships:
            if friendship.friend1_id == user_id:
                friendship.friend = friendship.friend2
            else:
                friendship.friend = friendship.friend1
        return friendships
