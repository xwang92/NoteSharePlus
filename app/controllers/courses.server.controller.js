'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Course = mongoose.model('Course'),
    _ = require('lodash');

/**
 * Send back the course object
 *
 * @param req.course the course object to send back
 */
exports.read = function(req, res) {
    res.json(req.course);
};

/**
 * Lists all courses available by school
 *
 * @param req.user The user object.
 */
exports.listBySchool = function(req, res, next) {
    var schoolId = req.query.school;
    var query = {};
    query.school = mongoose.Types.ObjectId(schoolId);
    if (schoolId){
        Course.find(query).exec(function(err, courses) {
            if (err) return next(err);
            if (!courses) return next(new Error('Failed to load courses with school ' + schoolId));
            res.json(courses);
        });
    } else {
        return res.status(403).send({
            message: 'Please provide a valid school Id for course search'
        });
    }
};

/**
 * Lists all courses available by course code
 *
 * @param req.user The user object.
 */
exports.listByCode = function(req, res, next) {

    if(req.query.code){

        var schoolId = req.query.school;
        var query = {};
        query.school = mongoose.Types.ObjectId(schoolId);
        query.code = { "$regex": req.query.code, "$options": "i" };
        if (schoolId){
            Course.find(query).exec(function(err, courses) {
                if (err) return next(err);
                if (!courses) return next(new Error('Failed to load courses with school ' + schoolId));
                res.json(courses);
            });
        } else {
            return res.status(403).send({
                message: 'User is registered to a school'
            });
        }
    }else{
        next();
    }


};



/**
 * Return all courses in the user profile
 */
exports.getUserCourses = function(req, res, next){
    res.json(req.user.courses);
}

/**
 * Add course user by ID
 * course stored in req.courses after processed by courses.findById
 */
exports.addToUser = function(req, res, next){

    var user = req.user;
    var course = req.course;
    var section_id = req.body.section;
    var courseIndex = findUserProfileCourse(course._id, user.courses);

    // if course already exist send 202, else add course and send the course info as response
    if (user.courses.length >= 7){
        return res.status(400).send({
            message: 'User already have 7 courses. Should not be allowed to have more'
        });
    }
    else if (courseIndex != -1 ){
        return res.status(202).send({
            message: 'Course Already Exist in User Profile'
        });
    }
    else {

        Course.findById(course._id).exec(function(err, course) {
            if (err) return next(err);
            if (!course) return next(new Error('Failed to load course ' + course.name));

            var user_course = {
                name: course.name,
                code: course.code,
                courseId: course._id,
                sectionId: section_id
            }

            user.courses.push(user_course);
            // save the update made to the user.course array
            user.save(function(err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
            });
            // send courses added as the response
            res.json(user.courses);
        });
    }
};

exports.removeFromUser = function(req, res, next){

    var user = req.user;
    //var index_pos = user.courses.indexOf(req.course._id);
    var index_pos = findUserProfileCourse(req.course._id, user.courses);

    if ( index_pos != -1 ){

        user.courses.splice(index_pos,1);
        user.save(function(err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }
        });
        // send courses added as the response
        res.json(user.courses);
    }
    else {
        return res.status(400).send({
            message: 'Course does not exit in User Profile'
        });
    }

}

function findUserProfileCourse(course_id, user_courses){

    var user_course;
    for(var i =0; i < user_courses.length; i++){
        if(user_courses[i].courseId.toString() == course_id.toString() ){
            return i;
        }
    }

    return -1;
};

/**
 * Checks if the user has authorization to access this course
 *
 * @param req.user current user
 * @param req.course the course the user is trying to access
 */
exports.hasAuthorization = function(req, res, next) {
    var user = req.user;
    var course = req.course;
    if (user.school.id === course.school.id) {
        next();
    } else {
        return res.status(403).send({
            message: 'Course school id does not match user school id'
        });
    }
};

/**
 * Middleware to find the course by ID. Packs the course object into req.course
 *
 */
exports.courseById = function(req, res, next, id) {
    Course.findById(id).exec(function(err, course) {
        if (err) return next(err);
        if (!course) return next(new Error('Failed to load course ' + id));
        req.course = course;
        next();
    });
};


/**
 * addCourse function used in the courses/update REST call
 *
 */
exports.addCourse = function(course, school, res, callback){

    // create json object with all course information
    var courseToAdd = new Course({
        name: course.name,
        code: course.code,
        school: school._id
    });

    // setup query object
    var query = {};
    query.name = course.name;
    query.code = course.code;

    // if the course is not in database, add it in
    // else just return directly
    Course.find(query).exec(function(err, courses) {
        if (err) return next(err);
        if (!courses) {
            saveCourse(courseToAdd, function(saved){
                callback();
                console.log('added course' + courseToAdd);
            });
        }
        else
            callback();
    });
};


exports.create = function(req, res) {
    var course = new Course(req.body);

    course.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(course);
        }
    });
};


exports.remove = function(req , res ){

    var course = req.course;

    course.remove(function(err) {
        if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(course);
		}
    });
};


function saveCourse(course, callback){

    course.save(function(err) {
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
