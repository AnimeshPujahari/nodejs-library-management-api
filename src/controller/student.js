//Core modules
const multer = require('multer');

//Models
const Student = require('../models/student');
const Book = require('../models/book');
const {welcomeMail , deleteMail} = require('../emails/account')

//Sign up Student
exports.createStudent = async (req, res) => {
    try{
        const student = new Student(req.body);
        const token = await student.generateAuthTokens();

        await student.save();
        welcomeMail(student.email , student.name);
    
        res.json({
            student,
            token
        })
    }catch(e){
        res.status(500).send(e);
    }
}


//Login a student 
exports.loginStudent = async (req, res) => {
    try{
        const student = await Student.loginTheStudent(req.body.email , req.body.password);
        const token = await student.generateAuthTokens();

        if(!student){
            throw new Error({ error: 'Unable to login' });
        }

        res.json({ student , token });
    }catch(e){
        res.status(500).send(e);
    }
}

//Issue a book
exports.requestBook = async (req, res) => {
    try{
        const book = await Book.findOne({ name : req.body.name });

        if(!book){
            return res.json({error : 'Book not found'});
        }
        req.student.books = req.student.books.concat({
            _id : book._id,
            name: book.name
        });
        await req.student.save();
        res.send(req.student);
    }catch(e){
        res.status(500).send(e);
    }
}


//Return a book
exports.returnBook = async (req, res) => {
    try{
        const bookToReturn = req.body.name;

        req.student.books = req.student.books.filter((book) => {
            return book.name !== bookToReturn;
        });

        await req.student.save();
        res.json({
            student : req.student
        })
    }catch(e){
        res.status(500).send(e);
    }
}

//Get the total books issued
exports.getBook = async (req, res) => {
    try{
        res.send({
            name: req.student.name,
            books: req.student.books
        })
    }catch(e){
        res.status(500).send(e);
    }
}


//Update a user
exports.updateStudent = async (req, res) => {

    const updates = Object.keys(req.body);
    const toUpdate = ['name' , 'email' , 'password'];
    const isValidate = updates.every((update) => {
        return toUpdate.includes(update);
    })

    if(!isValidate) {
        return res.status(400).send({ error : 'Invalid Operation' });
    }

    try{
        updates.forEach((update) => {
            req.student[update] = req.body[update];
        });

        await req.student.save();
        res.send({
            student: req.student
        })
    }catch(e){
        res.status(500).send(e);
    }
}


//Delete a Student
exports.deleteStudent = async (req, res) => {
    try{
        /* Condition to check if student has returned all books*/
        if(req.student.books.length !== 0){
            return res.status(400).send( {error : 'You have pending Books'} ); 
        }
        deleteMail(req.student.email , req.student.name);
        await req.student.remove();
        res.json({
            student : req.student
        })
    }catch(e){
        res.status(500).send(e);
    }
}


//Logging out a Student from one and multiple devices
exports.logOutStudent = async (req, res) => {
    try{
        req.student.tokens = req.student.tokens.filter((token) => {
            return token.token !== req.token;
        });

        await req.student.save();

        res.send({
            student: req.student
        });
    }catch(e){
        res.status(500).send(e);
    }
} 

exports.logOutAllDevice = async (req, res) => {
    try{
        req.student.tokens = [];
        await req.student.save();
        res.send({
            student: req.student
        })
    }catch(e){
        res.status(500).send(e);
    }
}

//Uploading an image file
exports.upload = multer({
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file , cb){

        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error({ error: 'File Type Invalid'}))
        }

        cb(undefined , true);
    }
});

exports.uploadProfilePic = async (req, res) => {
    try{
        req.student.profilepic = req.file.buffer;
        await req.student.save();
        res.send({
            student: req.student
        })
    }catch(e){
        res.status(500).send(e);
    }
}

