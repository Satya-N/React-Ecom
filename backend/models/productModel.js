const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please Enter Product Name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please Enter Product Description']
    },
    price: {
        type: Number,
        required: [true, 'Please Enter Product Price'],
        maxLength: [6, 'Price cannot exceed 8 figures']
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, 'Please Enter Product Category']
    },
    stock: {
        type: Number,
        required: [true, 'Please Enter Product Stock'],
        maxLength: [3, 'Stock Cannot Exceed 3 Characters'],
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;