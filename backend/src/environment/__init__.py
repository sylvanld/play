from os import getenv as _getenv

FLASK_ENV = _getenv('FLASK_ENV', 'development')

from .dev import *
  
if FLASK_ENV == 'production':
    from .prod import *
