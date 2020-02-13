from ..addons import db

association_table = db.Table('association', Base.metadata,
    db.Column('left_id', db.Integer, ForeignKey('left.id')),
    db. Column('right_id', db.String, ForeignKey('right.id'))
)

class ExternalIds(db.Model):
    isrc = db.Column(db.String, db.ForeignKey('track.isrc'), primary_key=True)
    
    youtube = db.Column(db.String, unique=True)
    spotify = db.Column(db.String, unique=True)
    deezer = db.Column(db.Integer, unique=True)
