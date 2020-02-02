from flask import request, redirect

from src.environment import PLAY_FRONTEND_URI
from ..database import Account, User
from ..dao import UserDAO, AccountDAO

class IdentityProvider:
    provider: str

    @classmethod
    def load_user_from_state(cls):
        state = request.args.get('state')
        if not state:
            return None
        else:
            return UserDAO.user_from_token(state)

    @classmethod
    def get_existing_account(cls, provider, email):
        return Account.query.filter_by(provider=provider, email=email).first()
            
    @classmethod
    def handle_authorization(cls, authorization_code, play_token=None):
        access_token = cls.get_token(authorization_code)
        identity = cls.get_identity(access_token)

        user = cls.load_user_from_state() or UserDAO.get_first(email=identity['email'])
        account = cls.get_existing_account(identity['provider'], identity['email'])

        if account and user is None:
            user = UserDAO.get_by_id(account.user_id)

        if user:
            if account is None:
                # create a new account for authenticated user
                account = AccountDAO.create({
                    'code': authorization_code,
                    'user_id': user.id,
                    **identity
                })
                # return to accounts page on frontend
                return redirect(PLAY_FRONTEND_URI + '/accounts')
            else:
                # user choose to sign-in using external provider
                # generate a new token and redirect to frontend
                token = UserDAO.get_token(user)['access_token']
                return redirect(PLAY_FRONTEND_URI + '?access_token=' + token)
        else:
            if account is not None: # TODO: test auth using this external account
                # load play user associated to this account
                user = UserDAO.get_by_id(account.user_id)
                # generate token for this user
                token = UserDAO.get_token(user)['access_token']
                return redirect(PLAY_FRONTEND_URI + '?access_token=' + token)
            else: # TODO: test create an account an auth using this account
                # create play account
                user = UserDAO.create({
                    'email': identity['email'],
                    'password': None
                })
                # bind third party account to play account
                account = AccountDAO.create({
                    'code': authorization_code,
                    'user_id': user.id,
                    **identity
                })
                # generate token and redirect
                token = UserDAO.get_token(user)['access_token']
                return redirect(PLAY_FRONTEND_URI + '?access_token=' + token)
        
        return identity
