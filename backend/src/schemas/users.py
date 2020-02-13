from ..addons import ma
from ..database import User
from marshmallow import fields

class UserSchema(ma.ModelSchema):
    email = fields.Email(required=True)
    password = fields.String(required=False, allow_none=True)

    class Meta:
        fields = ('id', 'email', 'name', 'lang', 'password')
        load_only = ('password',)
        dump_only = ('id',)
        model = User
    