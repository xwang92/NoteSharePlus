'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Section = mongoose.model('Section'),
    Course = mongoose.model('Course'),
    _ = require('lodash');

/**
 * Send back the course object
 *
 * @param req.course the course object to send back
 */
exports.read = function(req, res) {
    res.json(req.section);
};


/**
 * Lists all sections available by course
 *
 */
exports.listByCourse = function(req, res, next) {

    if(req.query.course){
        var courseId = req.query.course;
        var query = {};
        query.course = mongoose.Types.ObjectId(courseId);

        if (courseId){
            Section.find(query).exec(function(err, sections) {
                if (err) return next(err);
                if (!sections) return next(new Error('Failed to load courses with course ' + courseId));
                res.json(sections);
            });
        } else {
            return res.status(403).send({
                message: 'No section under this course'
            });
        }
    }else{
        return res.status(400).send({
        	message: 'Need a valid course Id to get sections under a course'
        });
    }

};


/**
 * Middleware to find the course by ID. Packs the course object into req.course
 *
 */
exports.sectionById = function(req, res, next, id) {
    Section.findById(id).exec(function(err, section) {
        if (err) return next(err);
        if (!section) return next(new Error('Failed to load section ' + id));
        req.section = section;
        next();
    });
};

exports.deleteSection = function(req, res){

    var section = req.section;

    section.remove(function(err) {
        if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(section);
		}
    });
}

exports.create = function(req, res) {

    var section = new Section(req.body);

    section.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            Course.findById(section.course).exec(function(err, course) {
                if (err) return res.status(400).send();
                if (!course) return res.status(400).send({
                    message: 'course not found'
                });
                course.sections.push(section._id);
                course.save(function(err) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        res.json(section);
                    }
                });
            });
        }
    });
};

function saveSection(section, callback){

    section.save(function(err) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else{
            callback();
        }
    });

};
