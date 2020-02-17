from ..addons import db, ma 
from ..exceptions import HttpError

from typing import Dict
from sqlalchemy.exc import IntegrityError


class DAO:
    model: db.Model
    schemas: Dict[str, ma.ModelSchema]

    @classmethod
    def load(cls, data, instance=None, schema='default'):
        Schema = cls.schemas[schema]
        instance = Schema().load(
            data, 
            instance=instance, 
            partial=instance is not None
        )
        return instance

    @classmethod
    def dump(cls, instances, many=False, schema='default'):
        Schema = cls.schemas[schema]
        instances = Schema(many=many).dump(instances)
        return instances

    @classmethod
    def get_by_id(cls, obj_id):
        return cls.model.query.filter_by(id=obj_id).first()

    @classmethod
    def get_or_404(cls, obj_id):
        obj = cls.get_by_id(obj_id)
        if not obj:
            raise HttpError("%s with id %s not found"%(cls.model.__name__, obj_id), 404)
        return obj

    @classmethod
    def get_first(cls, **kwargs):
        return cls.model.query.filter_by(**kwargs).first()

    @classmethod
    def filter(cls, *filters):
        return cls.model.query.filter(*filters).all()

    @classmethod
    def create(cls, data, commit=True, schema='default'):
        try:    
            instance = cls.load(data, schema=schema)
            db.session.add(instance)
            if commit:
                db.session.commit()
            return instance
        except IntegrityError as e:
            error = str(e).lower()
            if 'unique' in error:
                raise HttpError({
                    'message': 'Unique constraint failed when creating %s'%cls.model.__name__
                }, 409)
            else:
                raise e
            db.session.rollback()


    @classmethod
    def update(cls, obj_id, data):
        instance = cls.get_or_404(obj_id)
        instance = cls.load(data, instance=instance)
        db.session.add(instance)
        db.session.commit()
        return instance


    @classmethod
    def delete(cls, obj_id):
        instance = cls.get_or_404(obj_id)
        db.session.delete(instance)
        db.session.commit()
    