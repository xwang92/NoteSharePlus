'use strict';

/**
 * Module dependencies.
 */
var notes = require('../../app/controllers/notes.server.controller'),
    multer = require('multer'),
    users = require('../../app/controllers/users.server.controller');

module.exports = function(app) {
    // Note Routes
    app.route('/notes')
        .get(users.requiresLogin, notes.fromUser, notes.fromSection, notes.fromTag)
        .post(users.requiresLogin, notes.create);

    app.route('/notes/findAll')
        .get(notes.findAll);

    app.route('/notes/:noteId/image')
        .get(users.requiresLogin, notes.getImage)
        .post(users.requiresLogin,
            multer({
                dest: './uploads/tmp',
                limit: {
                    filesize: 5242880 // 5MB
                },
                onFileSizeLimit: function (file) {
                    fs.unlink('./' + file.path) // delete the partially written file
                    res.status(403).send({
                         message: 'Image size exceeds 5MB'
                    });
                }
            }), notes.hasAuthorization, notes.addImageToNote);

    app.route('/notes/:noteId/doc')
        .get(users.requiresLogin, notes.getDoc)
        .post(users.requiresLogin,
            multer({
                dest: './uploads/tmp',
                limit: {
                    filesize: 5242880 // 5MB
                },
                onFileSizeLimit: function (file) {
                    fs.unlink('./' + file.path) // delete the partially written file
                    res.status(403).send({
                         message: 'File size exceeds 5MB'
                    });
                }
            }), notes.hasAuthorization, notes.addDocToNote);

    app.route('/notes/:noteId')
        .get(notes.read)
        .put(users.requiresLogin, notes.hasAuthorization, notes.update)
        .delete(users.requiresLogin, notes.delete);

    //app.route('/notes/remove_tags/:noteId')
      //  .put(users.requiresLogin, notes.removeTags);

    app.route('/notes/tags/:noteId')
        .put(users.requiresLogin, notes.addTags)
        .delete(users.requiresLogin, notes.removeTags);

    app.route('/notes/ratings/:noteId')
        .put(users.requiresLogin, users.haveNotRated, notes.addRating);

    app.param('noteId', notes.noteById);
};
