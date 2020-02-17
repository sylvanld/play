from ..addons import db


class Friendship(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    friend1_id = db.Column(db.ForeignKey('user.id'), nullable=False)
    friend2_id = db.Column(db.ForeignKey('user.id'), nullable=False)
    accepted = db.Column(db.Boolean, default=False)

    friend1 = db.relationship('User', foreign_keys=[friend1_id])
    friend2 = db.relationship('User', foreign_keys=[friend2_id])
