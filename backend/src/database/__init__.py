from src.addons import db

from src.database.user import User
from src.database.account import Account, Provider
from src.database.friendship import Friendship

from src.database.track import Track
from src.database.playlist import Playlist, PlaylistTrack


def create_db(app):
    db.init_app(app)
    
    with app.app_context():
        db.drop_all()
        db.create_all()
        populate_db_friendship(db)
        """
        user = User(email='sledeunf@gmail.com', password='toto')
        db.session.add(user)
        db.session.commit()
        """


def populate_db_friendship(db):

    user1 = User(email="user1@gmail.com", password="toto")
    user2 = User(email="user2@gmail.com", password="toto")
    user3 = User(email="user3@gmail.com", password="toto")
    user4 = User(email="user4@gmail.com", password="toto")
    user5 = User(email="user5@gmail.com", password="toto")
    user6 = User(email="user6@gmail.com", password="toto")
    user7 = User(email="user7@gmail.com", password="toto")

    db.session.add_all([user1, user2, user3, user4, user5, user6, user7])

    user1_user2 = Friendship(friend1=user1, friend2=user2, accepted=True)
    user1_user3 = Friendship(friend1=user1, friend2=user3, accepted=True)
    
    user1_user4 = Friendship(friend1=user1, friend2=user4, accepted=False)
    user1_user5 = Friendship(friend1=user1, friend2=user5, accepted=False)

    user1_user6 = Friendship(friend1=user6, friend2=user1, accepted=False)
    user1_user7 = Friendship(friend1=user7, friend2=user1, accepted=False)

    db.session.add_all([user1_user2, user1_user3, user1_user4, user1_user5, user1_user6, user1_user7])

    db.session.commit()