const Book = require('../models/book');

//Creating Book controller
exports.createBook = async (req, res) => {
    try{
        const book = new Book({
            ...req.body,
            owner: req.admin._id
        });

        await book.save();
        res.status(200).json({
            book
        })
    }catch(e){
        res.status(500).send(e);
    }
}

//Get Book Data
exports.getBook = async (req, res) => {
    try{
        const book = await Book.findById(req.params.id);
        res.json({
            book
        });
    }catch(e){
        res.status(500).send();
    }
}

//Get all Book data by a particular admin
//GET /book/fetchAll?name=states
exports.getAllBook = async (req, res) => {
    try{
        const bookArray = [];

        await req.admin.populate({
            path : 'books',
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip)
            }
        }).execPopulate();

        if(req.query.name) {
            req.admin.books.forEach((book) => {
                if(book.name.toLowerCase().includes(req.query.name)){
                    bookArray.push(book);
                }
            });

            return res.json({
                bookArray
            })
        }

        res.json({
            books : req.admin.books
        })
    }catch(e){
        res.status(500).send(e);
    }
}

//Update book data
exports.updateBook = async (req, res) => {

    const updates = Object.keys(req.body);
    const toUpdate = ['name', 'author' , 'Quantity'];

    const isValidate = updates.every((update) => {
        return toUpdate.includes(update);
    });

    if(!isValidate) {
        return res.status(400).send({ error: 'Invalid Operation'});
    }

    try{
        const book = await Book.findById(req.params.id);
        
        updates.forEach((update) => {
            book[update] = req.body[update];
        });

        await book.save();
        res.json({
            book
        });
    }catch(e){
        res.status(500).send(e);
    }
}

//Delete Book data
exports.deleteBook = async (req, res) => {
    try{
        const book = await Book.findById(req.params.id);
        await book.remove();

        res.json({
            book,
            status: 'Removed'
        })
    }catch(e){
        res.status(500).send({ error : 'Book does not exist'});
    }
}

