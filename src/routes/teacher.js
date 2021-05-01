const express = require('express');

const {
    createTeacher,
    getTeacher,
    loginTeacher,
    updateTeacher,
    deleteTeacher,
    logoutTeacher,
    logoutAllTeacher,
    requestBook,
    returnBook,
    returnAllBook,
    upload,
    uploadImage
} = require('../controller/teacher');

const auth = require('../middlewares/teacherAuthenticaton');

const router = express.Router();

//Signup route
router.post('/teacher/signup' , createTeacher);

//Login route
router.post('/teacher/login' , loginTeacher);

//Book request route
router.post('/teacher/request', auth , requestBook);

//Book return route
router.post('/teacher/return' , auth , returnBook);

//Book return all route
router.post('/teacher/returnAll' , auth , returnAllBook);

//Log out route
router.post('/teacher/logout' , auth , logoutTeacher);

//Log out all route
router.post('/teacher/logoutAll' , auth , logoutAllTeacher);

//Upload teacher picture route
router.post('/teacher/upload' , auth , upload.single('avatar') , uploadImage);

//Get route
router.get('/teacher/me', auth , getTeacher);

//Update route
router.patch('/teacher/update', auth , updateTeacher);

//delete route
router.delete('/teacher/delete', auth , deleteTeacher);


module.exports = router;

