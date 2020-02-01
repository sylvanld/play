from ..addons import db, ma 
from typing import Dict
from flask import abort

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
            return abort(404)
        return obj

    @classmethod
    def filter(cls, *filters):
        return cls.model.query.filter(*filters).all()

    @classmethod
    def create(cls, data):        
        instance = cls.load(data)
        db.session.add(instance)
        db.session.commit()
        return instance


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
    