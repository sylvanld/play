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
        
        incoming = FriendshipDAO.friends_requests_incoming_for_user(current_user.id)
        outgoing = FriendshipDAO.friends_requests_outgoing_for_user(current_user.id)
        
        return {
            'accepted': FriendshipDAO.dump(accepted, many=True),
            'pending': {
                'incoming': FriendshipDAO.dump(incoming, many=True),
                'outgoing': FriendshipDAO.dump(outgoing, many=True)
            }
        }


@friends_ns.route('/friendships')
class FriendshipsResource(Resource):
    @jwt_required
    def post(self):
        """
        Initiate a friendship creation. (friend1 ask, friend2 will have to accept)
        """
        data = request.json or {}
        assert data.get('friend1_id') is None, "error bitch"

        data['friend1_id'] = current_user.id

        friendship = FriendshipDAO.create(data)
        return FriendshipDAO.dump(friendship)


@friends_ns.route('/friendships/<int:friendship_id>')
class FriendshipResource(Resource):
    @jwt_required
    def put(self, friendship_id):
        """
        Accept a friendship.
        """
        friendship = FriendshipDAO.update(friendship_id, request.json)
        return FriendshipDAO.dump(friendship)

    @jwt_required
    def delete(self, friendship_id):
        """
        Revoke / reject a friendship.
        """
        FriendshipDAO.delete(friendship_id)
