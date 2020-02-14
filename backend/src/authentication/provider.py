from flask import request, redirect
from urllib.parse import urlencode

from src.dao import UserDAO, AccountDAO
from src.environment import PLAY_FRONTEND_URI


class Provider:
    @classmethod
    def get_user_from_state(cls):
        token = request.args.get('state')
        if not token:
            return None
        else:
            return UserDAO.user_from_token(token)

    @classmethod
    def redirect_to_accounts(cls):
        return redirect(PLAY_FRONTEND_URI + '/accounts')

    @classmethod
    def redirect_authenticated(cls, user):
        tokenData = UserDAO.get_token(user)
        return redirect(PLAY_FRONTEND_URI + '?' + urlencode(tokenData))
    

    @classmethod
    def handle_authorization(cls, authorization_code):
        tokens = cls.get_token_from_code(authorization_code)
        identity = cls.get_identity_from_token(tokens['access_token'])
        user_from_state = cls.get_user_from_state()

        if user_from_state:
            # l'utilisateur etait connecte avant d'effectuer la requete
            # il cherche a lier son compte externe et son compte play
            account = AccountDAO.get_first(user_id=user_from_state.id, provider=identity['provider'])

            # verifie au prealable que le compte n'existe pas, en principe
            # c'est toujours le cas...
            if account is None:
               AccountDAO.create({
                    'user_id': user_from_state.id,
                    'refresh_token': tokens['refresh_token'],
                    **identity
               })
            # redirige l'utilisateur sur la page d'ou il vient (/accounts)
            return cls.redirect_to_accounts()      

        elif not user_from_state:
            # l'utilisateur n'etait pas connecte, 2 possibilites. Il veut soit
            # s'inscrire, soit se connecter en passant par un tiers
            account = AccountDAO.get_first(email=identity['email'], provider=identity['provider'])

            if account is None:
                # ce compte n'existe pas encore, l'utilisateur souhaite l'enregistrer
                guessed_user = UserDAO.get_first(email=identity['email'])
                if guessed_user:
                    # un utilisateur existe deja avec cette adresse email
                    # on suppose que ce sont les memes (TODO: demander confirmation)
                    AccountDAO.create({
                        'user_id': guessed_user.id,
                        'refresh_token': tokens['refresh_token'],
                        **identity
                    })
                    # le lien avec son compte externe etant un success on l'authentifie
                    return cls.redirect_authenticated(guessed_user)
                else:
                    # on ne peut absolument pas associer ce compte à un utilisateur play
                    # existant, on en crée un depuis les informations du provider externe.
                    new_user = UserDAO.create({
                        'email': identity['email'],
                        'name': identity['name'],
                        'lang': identity['lang'],
                        'password': None
                    })
                    # on crée l'association avec le compte chez le provider externe
                    AccountDAO.create({
                        'user_id': new_user.id,
                        'refresh_token': tokens['refresh_token'],
                        **identity
                    })
                    # apres creation de son compte, on peut l'authentifier
                    return cls.redirect_authenticated(new_user)
            else:
                # ce compte existe, l'utilisateur souhaite s'authentifier
                user = UserDAO.get_or_404(account.user_id)
                return cls.redirect_authenticated(user)
