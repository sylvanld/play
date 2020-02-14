from sqlalchemy.ext.hybrid import hybrid_property
from src.addons import db, bcrypt        


class User(db.Model):
    id      = db.Column(db.Integer, primary_key=True)
    email   = db.Column(db.String, unique=True, nullable=False)
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
