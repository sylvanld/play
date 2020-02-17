from flask import request
from flask_restplus import Namespace, Resource
from flask_jwt_extended import jwt_required, current_user

from ..dao import FriendshipDAO

friends_ns = Namespace('Friendship', '...', path='/')

@friends_ns.route('/users/me/friendships')
class UserFriendshipsResource(Resource):
    @jwt_required
    def get(self):
        """
        Return current user pending and accepted friendships
        """
        accepted = FriendshipDAO.friends_for_user(current_user.id)
        pending = FriendshipDAO.friends_requests_for_user(current_user.id)
        return {
            'accepted': FriendshipDAO.dump(accepted, many=True),
            'pending': FriendshipDAO.dump(pending, many=True)
        }


@friends_ns.route('/friendships')
class FriendshipsResource(Resource):
    @jwt_required
    def post(self):
        """
        Initiate a friendship creation. (friend1 ask, friend2 will have to accept)
        """
        return FriendshipDAO.create(request.json)


@friends_ns.route('/friendships/<int:friendship_id>')
class FriendshipResource(Resource):
    @jwt_required
    def put(self, friendship_id):
        """
        Accept a friendship.
        """
        return FriendshipDAO.update(friendship_id, request.json)

    @jwt_required
    def delete(self, friendship_id):
        """
        Revoke / reject a friendship.
        """
        FriendshipDAO.delete(friendship_id)
