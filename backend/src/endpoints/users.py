from flask import request
from flask_restplus import Resource, Namespace
from ..dao.user import UserDAO

users_ns = Namespace('users', '...', path='/users')

@users_ns.route('')
class UsersResource(Resource):
    def get(self):
        users = UserDAO.filter()
        return UserDAO.dump(users, many=True)
    
    def post(self):
        user = UserDAO.create(request.json)
        return UserDAO.dump(user)


@users_ns.route('/<int:user_id>')
class UserResource(Resource):
    def get(self, user_id):
        user = UserDAO.get_by_id(user_id)
        return UserDAO.dump(user)

    def put(self, user_id):
        user = UserDAO.update(user_id, request.json)
        return UserDAO.dump(user)

    def delete(self, user_id):
        UserDAO.delete(user_id)
