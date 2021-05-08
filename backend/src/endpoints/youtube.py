import requests, re
from urllib.parse import quote_plus

from flask import request
from flask_restplus import Namespace, Resource
from flask_jwt_extended import jwt_required

from src.cache import local_cache
from src.exceptions import HttpError

FAKE_BROWSER_HEADERS = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}

FAKE_BROWSER_HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'}
INPUT_PATTERN = re.compile('<input[^>]*name="(?P<name>[\w\d]+)"[^>]*value="(?P<value>[^>]+)"[^>]*>')
VIDEO_ID_PATTERN = re.compile('/watch\?v=(?P<videoId>[A-z0-9-]+)')

class YouTube:
    def __init__(self):
        self.__session = None

    def create_session(self):
        # create session with fake browse headers
        session = requests.Session()
        session.headers = FAKE_BROWSER_HEADERS
        
        # query youtube homepage to get accept cookies page
        response = session.get('https://www.youtube.com/')

        # parse accept cookies form data        
        accept_cookies_form_data = {}
        for match in INPUT_PATTERN.finditer(response.text):
            input_data = match.groupdict()
            accept_cookies_form_data[input_data['name']] = input_data['value']

        # send form to accept cookies
        response = session.post('https://consent.youtube.com/s', headers={'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9', 'Content-Type': 'application/x-www-form-urlencoded'}, data=accept_cookies_form_data)

        # return a session with cookies accepted
        return session

    @property
    def session(self):
        if self.__session is None:
            self.__session = self.create_session()
        return self.__session


youtube = YouTube()


@local_cache('cache/youtube_ids')
def get_youtube_video_id(query):
    response = youtube.session.get('https://www.youtube.com/results?q='+quote_plus(query))
    match = VIDEO_ID_PATTERN.search(response.text)
    
    if match is None:
        raise FileNotFoundError("Unable to retrieve videoId")
    
    return match.group('videoId')


youtube_ns = Namespace('Youtube', '...', path='/youtube')


@youtube_ns.route('/search')
class SearchYoutubeIdResource(Resource):
    #@jwt_required
    def get(self):
        if request.args.get('q') is None:
            raise HttpError('Missing query parameter (ex: q=connard)', 400)

        return {
            'id': get_youtube_video_id(request.args['q'])
        }
