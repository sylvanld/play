from .authentication import auth_ns, auth_bp
from .users import users_ns
from .accounts import accounts_ns
from .friendships import friends_ns

def create_endpoints(app, api):
    app.register_blueprint(auth_bp)

    api.add_namespace(auth_ns)
    api.add_namespace(users_ns)
    api.add_namespace(accounts_ns)
    api.add_namespace(friends_ns)
