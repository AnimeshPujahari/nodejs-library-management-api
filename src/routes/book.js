//Core packages
const express = require('express');

//Controller methods
const {createBook , updateBook , getBook , deleteBook , getAllBook} = require('../controller/book');

//Authenticate book
const auth = require('../middlewares/adminAuthentication');

const router = express.Router();

//Creating Book 
router.post('/book/create' , auth ,createBook);

//Fetch Book
router.get('/book/fetch/:id' , auth,getBook);

//Fetch all book created by a admin
router.get('/book/fetchAll' , auth , getAllBook);

//Updating Book
router.patch('/book/update/:id' , auth , updateBook);

//Deleting Book
router.delete('/book/delete/:id' , auth , deleteBook);


module.exports = router;