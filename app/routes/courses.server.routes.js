'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
    courses = require('../../app/controllers/courses.server.controller'),
    schools = require('../../app/controllers/schools.server.controller'),
    uoftapi = require('../../app/controllers/uoftapi.server.controller');

module.exports = function(app) {
    // Course Routes
    app.route('/courses')
        .get(courses.listByCode, courses.listBySchool)
        // TODO: used for testing. Course to be added via scraper
        .post(users.isAdmin, courses.create);

    app.route('/courses/user')
        .get(users.requiresLogin, courses.getUserCourses);

    app.route('/courses/user/:courseId')
        .post(users.requiresLogin, courses.hasAuthorization, courses.addToUser)
        .delete(users.requiresLogin, courses.hasAuthorization, courses.removeFromUser);

    app.route('/courses/:courseId')
        .get(courses.read)
        .delete(users.isAdmin, courses.remove);

    app.route('/courses/update/:schoolId')
        .get(users.isAdmin, uoftapi.addCourses);

    app.param('courseId', courses.courseById);
    app.param('schoolId', schools.schoolById);
};
