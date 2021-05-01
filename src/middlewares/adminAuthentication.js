const jwt = require('jsonwebtoken');

const Admin = require('../models/admins');

const auth = async (req , res , next) => {
    
    try{
        const token = req.header('Authorization').replace('Bearer ' , '');
        const decode = jwt.verify(token , process.env.JWT_SECRET_ADMIN);
        const admin = await Admin.findOne( { _id: decode._id , 'tokens.token' : token } );

        if(!admin){
            throw new Error({
                error: 'Admin not found'
            });
        }

        req.admin = admin;
        req.token = token;
        next()
    }catch(e){
        res.status(500).send(e);
    }

}

module.exports = auth;