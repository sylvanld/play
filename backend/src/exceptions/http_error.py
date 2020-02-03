import json
from flask import Response

class HttpError(Exception):
    def __init__(self, data, status: int, headers={}):
        self.data = json.dumps({'message': data} if type(data)==str else data)
        self.status = status
        self.headers = {
            'Content-Type': 'application/json',
            **headers
        }

    def make_response(self):
        return Response(self.data, self.status, self.headers)

    def __str__(self):
        return str(self.data)
