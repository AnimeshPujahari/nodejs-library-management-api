const multer = require('multer');
const Admin = require('../models/admins');
const {welcomeMail , deleteMail} = require('../emails/account');

//Create Admin
exports.createAdmin = async (req, res) => {
    try{
        const admin = new Admin(req.body);
        const token = await admin.generateAuthTokens();
        await admin.save();
        welcomeMail(admin.email, admin.name);
        res.json({
            admin, token
        });
    }catch(e){
        res.status(500).send(e);
    }
}


//Login Admin
exports.loginAdmin = async (req, res) => {
    try{
        const admin = await Admin.findByCredentials(req.body.email , req.body.password);
        const token = await admin.generateAuthTokens();
        if(!admin){
            return res.json({
                error: 'No admin found'
            });
        }

        res.json({
            admin, token
        })
    }catch(e){
        res.status(500).send(e);
    }
}


//Get Admin Info
exports.getAdmin = async (req, res) => {
    res.json({
        admin: req.admin
    })
}


//Update Admin Details
exports.updateAdmin = async (req, res) => {
    
    const updates = Object.keys(req.body);
    
    try{
        updates.forEach((update) => {
            req.admin[update] = req.body[update];
        });

        await req.admin.save();
        res.json({
           admin: req.admin
        })
    }catch(e){
        res.status(500).send(e);
    }
}


//Delete Admin
exports.deleteAdmin = async (req, res) => {
    try{
        deleteMail(req.admin.email , req.admin.name);
        await req.admin.remove();

        res.json({
            admin : req.admin
        })
    }catch(e){
        res.status(500).send(e);
    }
}

//Log out Admin
exports.logoutAdmin = async (req, res) => {
    try{
        req.admin.tokens = req.admin.tokens.filter((token) => {
            return token.token !== req.token;
        });

        await req.admin.save();
        res.json({
            admin : req.admin
        })
    }catch(e){
        res.status(500).send(e);
    }
}


//Log out All Admin
exports.logoutAllAdmin = async (req , res) => {
    try{
        req.admin.tokens = [];
        await req.admin.save();

        res.json({
            admin: req.admin
        })
    }catch(e){
        res.status(500).send(e);
    }
}


//Upload Pic Admin
exports.upload = multer({
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file ,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error({ error : 'Invalid File Type' }));
        }

        cb(undefined , true);
    }
});

exports.uploadImage = async (req, res) => {
    try{
        req.admin.profilePic = req.file.buffer;
        await req.admin.save();

        res.json({
            admin: req.admin
        })
    }catch(e){
        res.status(500).send(e);
    }
}