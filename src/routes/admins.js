const express = require('express');

const {
    createAdmin,
    updateAdmin,
    deleteAdmin,
    getAdmin,
    loginAdmin,
    logoutAdmin,
    logoutAllAdmin,
    upload,
    uploadImage
} = require('../controller/admins');

const auth = require('../middlewares/adminAuthentication');

const router = express.Router();

//Creating an admin
router.post('/admin/signup' , createAdmin);

//Login Admin
router.post('/admin/login' , loginAdmin);

//Logout Admin
router.post('/admin/logout' , auth , logoutAdmin);

//Logout all admin
router.post('/admin/logoutAll' , auth , logoutAllAdmin);

//Upload pic admin
router.post('/admin/upload' , auth , upload.single('avatar') , uploadImage);

//Get admin
router.get('/admin/me' , auth , getAdmin);

//Update admin
router.patch('/admin/update', auth , updateAdmin);

//Delet amdin
router.delete('/admin/delete', auth , deleteAdmin);


module.exports = router;

