from src.addons import db

from src.database.user import User
from src.database.account import Account, Provider
from src.database.friendship import Friendship

from src.database.track import Track
from src.database.artist import Artist
from src.database.album import Album
from src.database.playlist import Playlist


def create_db(app):
    db.init_app(app)
    
    with app.app_context():
        db.drop_all()
        db.create_all()

        user = User(email='sledeunf@gmail.com', password='toto')
        db.session.add(user)
        db.session.commit()
