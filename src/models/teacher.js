const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const teacherSchema = new mongoose.Schema({

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
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error(
                    {
                        error: 'Invalid Email'
                    }
                )
            }
        }
    },

    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if(value.toLowerCase().includes('password')){
                throw new Error({
                    error: 'Password should not contain word password'
                })
            }
      }
    },

    books: [
        {
            bookName:{
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

    profilePic: {
        type: Buffer
    }

},
{timestamps: true});


//Hide sensitive data
teacherSchema.methods.toJSON = function() {
    const teacher = this;

    const teacherObject = teacher.toObject();

    delete teacherObject.password;
    delete teacherObject.tokens;
    delete teacherObject._id;
    delete teacherObject.profilePic;

    return teacherObject;
}


//Authenticate teacher
teacherSchema.methods.createAuthenticationTokens = async function() {
    const teacher = this;

    const token = jwt.sign( {_id : teacher._id} , process.env.JWT_SECRET_TEACHER);

    teacher.tokens = teacher.tokens.concat({ token });

    await teacher.save();

    return token;
}


//Login teacher
teacherSchema.statics.findByCredentials = async (email , password) => {

    const teacher = await Teacher.findOne({email});
    if(!teacher){
        throw new Error('Unable to login');
    }

    const isValidate = await bcrypt.compare(password , teacher.password);

    if(!isValidate){
        throw new Error('Unable to login');
    }

    return teacher;
}


//Encrypt password
teacherSchema.pre('save' , async function(next) {

    const teacher = this;

    if(teacher.isModified('password')){
        teacher.password = await bcrypt.hash(teacher.password , 8);
    }

    next();
})


const Teacher = mongoose.model('Teacher' , teacherSchema);

module.exports = Teacher;