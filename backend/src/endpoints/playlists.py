from flask import request
from flask_restplus import Namespace, Resource
from flask_jwt_extended import jwt_required

from ..dao import TrackDAO, PlaylistDAO

playlists_ns = Namespace('Playlists', '...', path='/')


@playlists_ns.route('/playlists')
class PlaylistsResource(Resource):
    @jwt_required
    def get(self):
        """
        Get all playlists for current user
        """
        return PlaylistDAO.filter()

    @jwt_requried
    def post(self):
        """
        Create a new playlist for current user
        """


@playlists_ns.route('/playlists/<int:playlist_id>')
    @jwt_required
    def get(self, playlist_id):
        """
        Get a playlist
        """
    
    @jwt_required
    def put(self, playlist_id):
        """
        Edit a playlist
        """

    @jwt_required
    def delete(self, playlist_id):
        """
        Delete a playlist
        """


@playlists_ns.route('/playlists/<int:playlist_id>/tracks')
class PlaylistTracksResource(Resource):
    def post(self, playlist_id):
        """
        Add tracks to a playlist.
        """

@playlists_ns.route('/playlists/<int:playlist_id>/tracks/<int:position>')
    def delete(self, playlist_id, position):
        """
        Delete track of a playlist at given position.
        """


@playlists_ns.route('/tracks/<string:isrc>/external_ids')
class EditExternalIds(Resource):
    @jwt_required
    def put(self, isrc):
        """
        Edit external ids.
        """