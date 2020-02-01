from ..database import Account, User

class IdentityProvider:
    @classmethod
    def handle_authorization(cls, authorization_code, play_token=None):
        access_token = cls.get_token(authorization_code)
        identity = cls.get_identity(access_token)

        if play_token:
            "user already exists and is authenticated -> add account"
        else:
            "user do not exists or is not authenticated"
            if "third party account registered":
                "generate token and redirect"
            else:
                "create play account"
                "bind third party account to play account"
                "generate token and redirect"
        
        return identity
