from flask import request
from flask_restplus import Resource, Namespace
from flask_jwt_extended import jwt_required, current_user

from ..dao.user import UserDAO
from ..dao.friendship import FriendshipDAO

users_ns = Namespace('users', '...', path='/users')


@users_ns.route('')
class UsersResource(Resource):
    def get(self):
        """
        Browse users
        """
        users = UserDAO.filter()
        return UserDAO.dump(users, many=True)

    def post(self):
        """
        Create user
        """
        user = UserDAO.create(request.json)
        return UserDAO.dump(user)


@users_ns.route('/me')
class CurrentUserResource(Resource):
    @jwt_required
    def get(self):
        """
        Get current user's details
        """
        return UserDAO.dump(current_user)


@users_ns.route('/<int:user_id>')
class UserResource(Resource):
    def get(self, user_id):
        """
        Get user's details
        """
        user = UserDAO.get_by_id(user_id)
        return UserDAO.dump(user)

    def put(self, user_id):
        """
        Edit user's details
        """
        user = UserDAO.update(user_id, request.json)
        return UserDAO.dump(user)

    def delete(self, user_id):
        """
        Delete a user
        """
        UserDAO.delete(user_id)


@users_ns.route('/me/friends')
class MyAccounts(Resource):
    @jwt_required
    def get(self):
        """
        Return friend accounts for a current user
        """
        users = FriendshipDAO.friends_for_user(current_user.id)
        return UserDAO.dump(users, many=True)
