from marshmallow import fields, EXCLUDE
from marshmallow_enum import EnumField

from ..addons import ma
from ..database import Account, Provider

class AccountSchema(ma.ModelSchema):
    email = fields.Email(required=True)
    external_id = fields.String(required=True)
    provider = EnumField(Provider)

    class Meta:
        unknown = EXCLUDE
        model = Account
        fields = ('id', 'email', 'name', 'external_id', 'provider', 'code', 'user_id')
        load_only = ('code',)
        dump_only = ('id',)
