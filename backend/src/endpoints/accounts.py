from flask_restplus import Namespace, Resource
from ..dao import AccountDAO

accounts_ns = Namespace('Accounts', '...', path='/users/<user_id>/accounts')

@accounts_ns.route('')
class UserAccounts(Resource):
    def get(self, user_id):
        """
        Return third-party accounts for a given user
        """
        accounts = AccountDAO.accounts_for_user(user_id)
        return AccountDAO.dump(accounts, many=True)
