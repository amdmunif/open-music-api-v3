const ClientError = require('../../exceptions/ClientError');

class PlaylistsHandler {
    constructor(service, validator) {
        this._validator = validator;
        this._service = service;

        this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
        this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
        this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    }

    async postPlaylistHandler(request, h) {
        try {
            this._validator.validatePlaylistPayload(request.payload);

            const { name } = request.payload;
            const { id: credentialId } = request.auth.credentials;
            const playlistId = await this._service.addPlaylist({
                name,
                owner: credentialId,
            });

            const response = h.response({
                status: 'success',
                message: 'Playlist berhasil ditambahkan',
                data: {
                    playlistId,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }
            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async getPlaylistHandler(request, h) {
        const { id: credentialId } = request.auth.credentials;
        const playlists = await this._service.getPlaylist(credentialId);

        const response = h.response({
            status: 'success',
            data: {
                playlists,
            },
        });
        response.code(200);
        return response;
    }

    async deletePlaylistByIdHandler(request, h) {
        try {
            const { id: credentialId } = request.auth.credentials;
            const { playlistId } = request.params;

            await this._service.verifyPlaylistOwner(playlistId, credentialId);
            await this._service.deletePlaylistById(playlistId, credentialId);

            const response = h.response({
                status: 'success',
                message: 'Playlist berhasil dihapus',
            });
            response.code(200);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }
            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }
}

module.exports = PlaylistsHandler;