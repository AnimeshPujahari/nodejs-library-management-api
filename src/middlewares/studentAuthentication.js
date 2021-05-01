const jwt = require('jsonwebtoken');
const Student = require('../models/student');

const auth = async (req, res , next) => {

    try{
        const token = req.header('Authorization').replace('Bearer ' , '');
        const decoded = jwt.verify(token , process.env.JWT_SECRET_STUDENT);
        const student = await Student.findOne({ _id : decoded._id , 'tokens.token' : token } );
        
        if(!student){
            return res.status(404).send();
        }

        req.student = student;
        req.token = token;
        next()
    }catch(e){
        res.status(500).send(e);
    }
}

module.exports = auth;