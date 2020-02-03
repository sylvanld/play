from ..dao import UserDAO

def configure_jwt(jwt):
    @jwt.user_identity_loader
    def identity_loader(user):
        return user.id

    @jwt.user_loader_callback_loader
    def user_loader(identity):
        return UserDAO.get_or_404(identity)