const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const studentSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error( { error : 'Invalid Email' } )
            }
        }
    },

    password: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error( {error: 'Password can not contain password'} );
            }
        }
    },

    books: [
        {
            name: {
                type: String
            }
        }
    ],

    tokens: [
        {
            token:{
                type: String,
                required: true
            }
        }
    ],

    profilepic: {
        type: Buffer
    }
},
{timestamps: true});


//Generate tokens while creating a student or loggin in
studentSchema.methods.generateAuthTokens = async function() {

    const student = this;

    const token = jwt.sign( {_id : student._id.toString()} , process.env.JWT_SECRET_STUDENT);

    student.tokens = student.tokens.concat( { token } );

    await student.save();

    return token;
}


//Login a student
studentSchema.statics.loginTheStudent = async (email , password) => {

    const student = await Student.findOne({ email });

    if(!student){
        throw new Error('Unable to login');
    }

    const isValidate = await bcrypt.compare(password , student.password);

    if(!isValidate){
        throw new Error('Unable to login');
    }

    return student;
}


//Hide certain data
studentSchema.methods.toJSON = function() {
    const student = this;

    const userObject = student.toObject();

    delete userObject.password;
    delete userObject._id;
    delete userObject.tokens;

    return userObject;
}


//Hashing the password of student
studentSchema.pre('save' , async function(next) {
    const student = this;

    if(student.isModified('password')){
        student.password = await bcrypt.hash(student.password , 8);
    }
    
    next();
})


const Student = mongoose.model('Student' , studentSchema);

module.exports = Student;