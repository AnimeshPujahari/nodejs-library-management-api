const express = require('express');

const {
    createStudent , 
    requestBook , 
    getBook , 
    deleteStudent , 
    returnBook ,
    loginStudent,
    updateStudent,
    logOutStudent,
    logOutAllDevice,
    upload,
    uploadProfilePic
} = require('../controller/student');

const auth = require('../middlewares/studentAuthentication');

const router = express.Router();

//Signup Student
router.post('/student/signup' , createStudent);

//Login the student
router.post('/student/login' , loginStudent);

//Issue book by student
router.post('/student/issue/book', auth , requestBook);

//Return book based on book id
router.post('/student/return/book' , auth , returnBook);

//Update a Student
router.post('/student/update' , auth , updateStudent);

//Log Out student
router.post('/student/logout' , auth , logOutStudent);
router.post('/student/logoutAll' , auth , logOutAllDevice);

//Uploading profile pic
router.post('/student/upload' , auth , upload.single('avatar') , uploadProfilePic);

//Get Student book details
router.get('/student/getbooks', auth , getBook);

//Delete Student
router.delete('/student/delete' , auth , deleteStudent);

module.exports = router;