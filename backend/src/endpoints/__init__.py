from .authentication import auth_ns
from .users import users_ns
from .accounts import accounts_ns

def create_endpoints(api):
    api.add_namespace(auth_ns)
    api.add_namespace(users_ns)
    api.add_namespace(accounts_ns)
