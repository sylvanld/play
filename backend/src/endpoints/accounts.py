from flask_restplus import Namespace, Resource
from flask_jwt_extended import jwt_required, current_user
from ..dao import AccountDAO

accounts_ns = Namespace('Accounts', '...', path='/')

@accounts_ns.route('/users/<user_id>/accounts')
class UserAccounts(Resource):
    def get(self, user_id):
        """
        Return third-party accounts for a given user
        """
        accounts = AccountDAO.accounts_for_user(user_id)
        return AccountDAO.dump(accounts, many=True)


@accounts_ns.route('/users/me/accounts')
class MyAccounts(Resource):
    @jwt_required
    def get(self):
        """
        Return third-party accounts for a current user
        """
        print(current_user.id)
        accounts = AccountDAO.accounts_for_user(current_user.id)
        return AccountDAO.dump(accounts, many=True)
