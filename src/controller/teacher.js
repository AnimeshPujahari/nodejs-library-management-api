const multer = require('multer');

const Teacher = require('../models/teacher');
const Book = require('../models/book');
const {welcomeMail , deleteMail} = require('../emails/account');

//Teacher signup
exports.createTeacher = async (req, res) => {
    try{
        const teacher = new Teacher(req.body);
        const token = await teacher.createAuthenticationTokens();
        await teacher.save();
        welcomeMail(teacher.email, teacher.name);

        res.json({
            teacher, token
        })
    }catch(e){
        res.status(500).send(e);
    }
}

//Teacher Login 
exports.loginTeacher = async (req, res) => {
    try{
        const teacher = await Teacher.findByCredentials(req.body.email , req.body.password);
        const token = await teacher.createAuthenticationTokens();
        if(!teacher) {
            throw new Error({
                error: 'Teacher not found'
            });
        }

        res.json({
            teacher , token
        })
    }catch(e){
        res.status(500).send(e);
    }
}

//Teacher Profile method
exports.getTeacher = async (req, res) => {
    res.json({
        teacher : req.teacher
    })
}


//Teacher Update profile method
exports.updateTeacher = async (req, res) => {
    const updates = Object.keys(req.body);
    const toUpdate = ['name' , 'email' , 'password'];
    const isValidate = updates.every((update) => {
        return toUpdate.includes(update);
    })

    if(!isValidate) {
        return res.send({
            error: 'Invalid operation'
        })
    }

    try{
        updates.forEach((update) => {
            req.teacher[update] = req.body[update];
        });

        await req.teacher.save();
        res.json({
            teacher : req.teacher
        })
    }catch(e){
        res.status(500).send(e);
    }
}


//Teacher delete profile method
exports.deleteTeacher = async (req, res) => {
    try{
        if(req.teacher.books.length !== 0){
            return res.status(400).send({
                error: 'Book pending to return'
            })
        }
        deleteMail(req.teacher.email , req.teacher.name);
        await req.teacher.remove();

        res.json({
            teacher: req.teacher
        })
    }catch(e){
        res.status(500).send(e);
    }
}

//Teacher logout
exports.logoutTeacher = async (req, res) => {
    try{
        req.teacher.tokens = req.teacher.tokens.filter((token) => {
            return token.token !== req.token;
        });

        await req.teacher.save();

        res.json({
            teacher: req.teacher
        })
    }catch(e){

    }
}


//Teacher logoutAll
exports.logoutAllTeacher = async (req, res) => {
    try{
        req.teacher.tokens = [];
        await req.teacher.save();

        res.json({
            teacher: req.teacher
        })
    }catch(e){
        res.status(500).send(e);
    }
}

/****** Book routes ******/

//Request for book
exports.requestBook = async (req, res) => {
    try{
        const book = await Book.findOne( { name : req.body.name } );
        if(!book){
            throw new Error({
                error: 'Book not found/out of stock'
            })
        }

        req.teacher.books = req.teacher.books.concat({
            _id : book._id,
            bookName: book.name
        });

        await req.teacher.save();

        res.json({
            teacher : req.teacher
        })
    }catch(e){
        res.status(500).send(e);
    }
}

//Return specific book
exports.returnBook = async (req, res) => {
    try{

        const book = req.teacher.books.forEach((book) => {
            return book.bookName === req.body.book;
        })

        if(!book) {
            return res.status(404).send({
                error: 'Book not found/Book already returned'
            })
        }

        req.teacher.books = req.teacher.books.filter((book) => {
            return book.bookName !== req.body.name;
        });

        await req.teacher.save();

        res.json({
            teacher: req.teacher
        })

    }catch(e){
        res.status(500).send(e)
    }
}

//Return all book
exports.returnAllBook = async (req, res) => {
    try{
        req.teacher.books = [];

        await req.teacher.save();

        res.json({
            teacher : req.teacher
        })
    }catch(e){
        res.status(500).send(e);
    }
}

/**** Profile Pic add ****/
exports.upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error({error: 'File Type Invalid'}));
        }

        cb(undefined , true)
    }
});

exports.uploadImage = async (req , res) => {
    try{
        req.teacher.profilePic = req.file.buffer;

        await req.teacher.save();
        res.json({
            teacher : req.teacher
        });
    }catch(e){
        res.status(500).send(e);
    }
}