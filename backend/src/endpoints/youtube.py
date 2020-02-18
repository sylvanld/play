import requests, re
from urllib.parse import quote_plus

from flask import request
from flask_restplus import Namespace, Resource
from flask_jwt_extended import jwt_required

from src.cache import local_cache
from src.exceptions import HttpError


session = requests.Session()
session.headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}
videoIdRegex = re.compile('/watch\?v=(?P<videoId>[A-z0-9-]+)')

@local_cache('cache/youtube_ids')
def get_youtube_video_id(query):
    r = session.get('https://www.youtube.com/results?q='+quote_plus(query))
    assert r.status_code == 200, "Failed to find youtube video"
    videoId = videoIdRegex.search(r.text).group('videoId')
    return videoId


youtube_ns = Namespace('Youtube', '...', path='/youtube')


@youtube_ns.route('/search')
class SearchYoutubeIdResource(Resource):
    @jwt_required
    def get(self):
        if request.args.get('q') is None:
            raise HttpError('Missing query parameter (ex: q=connard)', 400)

        return {
            'id': get_youtube_video_id(request.args['q'])
        }
