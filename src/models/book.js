const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    author: {
        type: String,
        required: true,
        trim: true
    },

    quantity: {
        type: Number,
        required: true,
        validate(value) {
            if(value < 0){
                throw new Error('Invalid Quantity');
            }
        }
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Admin'
    }
},
{timestamps : true});


//Hide private data
bookSchema.methods.toJSON = function() {
    const book = this;

    const bookObject = book.toObject();

    delete bookObject.owner;
    delete bookObject._id;

    return bookObject;
}

const Book = mongoose.model('Book' , bookSchema);

module.exports = Book;