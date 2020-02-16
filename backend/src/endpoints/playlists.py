from flask import request
from flask_restplus import Namespace, Resource
from flask_jwt_extended import jwt_required

from ..dao import TrackDAO, PlaylistDAO

playlists_ns = Namespace('Playlists', '...', path='/')


@playlists_ns.route('/playlists')
class PlaylistsResource(Resource):
    def get(self):
        """
        Get playlists
        """
        playlists = PlaylistDAO.filter()
        return PlaylistDAO.dump(playlists, many=True)

    def post(self):
        """
        Create a playlist
        """
        playlist = PlaylistDAO.create(request.json)
        return PlaylistDAO.dump(playlist)


@playlists_ns.route('/playlists/<int:playlist_id>')
class PlaylistResource(Resource):
    def get(self, playlist_id):
        """
        Get a playlist and its tracks
        """
        playlist = PlaylistDAO.get_or_404(playlist_id)
        return PlaylistDAO.dump(playlist, schema='full')


@playlists_ns.route('/playlists/<int:playlist_id>/tracks')
class PlaylistTracksResource(Resource):
    def post(self, playlist_id):
        """
        Add tracks to a playlist
        """
        tracks = PlaylistDAO.add_tracks(playlist_id, request.json)
        return TrackDAO.dump(tracks, many=True)

    def put(self, playlist_id):
        """
        Edit tracks of a playlist (require to resend all to avoid ordering conflict with async)
        """
        tracks = PlaylistDAO.update_tracks(playlist_id, request.json)
        return TrackDAO.dump(tracks, many=True)


@playlists_ns.route('/tracks/<string:isrc>/external_ids')
class EditExternalIds(Resource):
    @jwt_required
    def put(self, isrc):
        """
        Edit external ids.
        """