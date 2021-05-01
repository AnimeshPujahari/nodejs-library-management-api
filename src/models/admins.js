const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema({

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
                throw new Error( {error : 'Invalid Email'} );
            }
        }
    },

    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error({error : 'Password can not contain password'});
            }
        }
    },

    tokens: [
        {
            token: {
                type:String,
                required: true
            }
        }
    ],

    profilePic: {
        type: Buffer
    }
});


//Virtual
adminSchema.virtual('books' , {
    ref: 'Book',
    localField: '_id',
    foreignField: 'owner'
})


//Hide private data
adminSchema.methods.toJSON = function(){
    const admin = this;

    const adminObject = admin.toObject();

    delete adminObject.tokens;
    delete adminObject.password;
    delete adminObject.profilePic;
    
    return adminObject;
}


//Login User
adminSchema.statics.findByCredentials = async (email , password) => {

    const admin = await Admin.findOne({email});

    if(!admin){
        throw new Error({
            error: 'Unable to login'
        })
    }

    const isValidate = await bcrypt.compare(password , admin.password);

    if(!isValidate) {
        throw new Error({
            error: 'Unable to login'
        })
    }

    return admin;
}


//Generate tokens and save
adminSchema.methods.generateAuthTokens = async function(){

    const admin = this;

    const token = jwt.sign( {_id: admin._id} , process.env.JWT_SECRET_ADMIN);

    admin.tokens = admin.tokens.concat( {token} );

    await admin.save();

    return token;
}


//Hash the password
adminSchema.pre('save' , async function(next) {
    const admin = this;

    if(admin.isModified('password')){
        admin.password = await bcrypt.hash(admin.password , 8);
    }

    next();
})


const Admin = mongoose.model('Admin' , adminSchema);

module.exports = Admin;