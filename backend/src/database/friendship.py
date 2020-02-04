from ..addons import db


class Friendship(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    friend1 = db.Column(db.ForeignKey('user.id'), nullable=2)
    friend2 = db.Column(db.ForeignKey('user.id'), nullable=2)
    accepted = db.Column(db.Boolean, default=False)
