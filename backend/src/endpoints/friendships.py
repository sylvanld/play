from flask import request
from flask_restplus import Namespace, Resource

from ..dao import FriendshipDAO

friends_ns = Namespace('Friendship', '...', path='/')

@friends_ns.route('/users/me/friendships')
class UserFriendshipsResource(Resource):
    def get(self, user_id):
        """
        Return current user pending and accepted friendships
        """
        accepted = FriendshipDAO.friends_for_user(user_id)
        pending = FriendshipDAO.friends_requests_for_user(user_id)
        return {
            'accepted': FriendshipDAO.dump(accepted, many=True),
            'pending': FriendshipDAO.dump(pending, many=True)
        }


@friends_ns.route('/friendships')
class FriendshipsResource(Resource):
    def post(self):
        """
        Initiate a friendship creation. (friend1 ask, friend2 will have to accept)
        """
        return FriendshipDAO.create(request.json)


@friends_ns.route('/friendships/<int:friendship_id>')
class FriendshipResource(Resource):
    def put(self, friendship_id):
        """
        Initiate a friendship creation. (friend1 ask, friend2 will have to accept)
        """
        return FriendshipDAO.update(friendship_id, request.json)

    def delete(self, friendship_id):
        """
        Revoke a friendship.
        """
        FriendshipDAO.delete(friendship_id)
