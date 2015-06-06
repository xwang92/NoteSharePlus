'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
    schools = require('../../app/controllers/schools.server.controller');

module.exports = function(app) {
    // Article Routes
    app.route('/schools')
        .get(schools.schoolByName, schools.list)
        .post(users.isAdmin, schools.create);

    app.route('/schools/:schoolId')
        .get(schools.read)
        .put(users.requiresLogin, schools.hasAuthorization, users.registerSchool)
        .delete(users.isAdmin, schools.remove);

    // School middleware
    app.param('schoolId', schools.schoolById);
};
