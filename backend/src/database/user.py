from sqlalchemy.ext.hybrid import hybrid_property
from src.addons import db, bcrypt

# TODO: move somewhere else
from random import randint
alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
def random_username():
    return ''.join([
        alpha[randint(0, 61)] for _ in range(randint(6, 10) )
    ])


class User(db.Model):
    id      = db.Column(db.Integer, primary_key=True)
    email   = db.Column(db.String, unique=True, nullable=False)
    name    = db.Column(db.String, default=random_username)
    lang    = db.Column(db.String, default='EN')
    pwdhash = db.Column(db.String)

    @hybrid_property
    def password(self):
        return None

    @password.setter
    def password(self, phrase=None):
        if phrase is not None:
            self.pwdhash = bcrypt.generate_password_hash(phrase)

    def check_password(self, candidate):
        if self.pwdhash is None:
            return False
        
        return bcrypt.check_password_hash(self.pwdhash, candidate)
