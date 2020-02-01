from src.addons import db

from src.database.user import User
from src.database.account import Account


def create_db(app):
    db.init_app(app)
    
    with app.app_context():
        db.drop_all()
        db.create_all()

        user = User(email='sledeunf@gmail.com', password='toto')
        db.session.add(user)
        db.session.commit()
