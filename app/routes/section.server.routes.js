'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
    courses = require('../../app/controllers/courses.server.controller'),
    sections = require('../../app/controllers/section.server.controller');

module.exports = function(app) {

    app.route('/sections')
        .get(sections.listByCourse)
        .post(users.isAdmin, sections.create);

    app.route('/sections/:sectionId')
        .get(sections.read)
        .delete(users.isAdmin, sections.deleteSection);

    app.param('sectionId', sections.sectionById);
    app.param('courseId', courses.courseById);
};
