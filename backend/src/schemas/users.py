from ..addons import ma
from ..database import User
from marshmallow import fields

class UserSchema(ma.ModelSchema):
    email = fields.Email(required=True)
    password = fields.String(required=True)

    class Meta:
        fields = ('id', 'email', 'password')
        load_only = ('password',)
        dump_only = ('id',)
        model = User
    