const jwt = require('jsonwebtoken');
const Teacher = require('../models/teacher');

const auth = async (req, res ,next) => {
    try{

        const token = req.header('Authorization').replace('Bearer ' , '');
        const decode = jwt.verify( token , process.env.JWT_SECRET_TEACHER);
        const teacher = await Teacher.findOne( { _id : decode._id , 'tokens.token' : token}  );

        if(!teacher){
            return res.status(404).send();
        }

        req.teacher = teacher;
        req.token = token;
        next();
    }catch(e){
        res.status(500).send(e);
    }
}

module.exports = auth;