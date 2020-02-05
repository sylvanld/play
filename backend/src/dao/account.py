from ..database import Account, User
from ..schemas import AccountSchema
from ._dao import DAO

class AccountDAO(DAO):
    model = Account
    schemas = {
        'default': AccountSchema
    }

    @classmethod
    def accounts_for_user(cls, user_id):
        accounts = cls.filter(
            user_id == Account.user_id
        )
        return accounts
