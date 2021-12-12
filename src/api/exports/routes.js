const routes = (handler) => [{
    method: 'POST',
    path: '/export/songs',
    handler: handler.postExportSongsHandler,
    options: {
        auth: 'songsapp_jwt',
    },
}, ];

module.exports = routes;