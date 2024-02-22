const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    userId: {
        ref: 'Users',
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true,
    },
    name: {
        required: true,
        type: String
    },

    image: {
        required: true,
        type: String
    },
    category: {
        required: true,
        type: String
    },
    brand: {
        required: true,
        type: String
    },
    price: {
        required: true,
        type: Number
    },
    rating: {
        required: true,
        type: String
    },
    numReview: {
        required: true,
        type: String
    },
    countInStock: {
        ref: "Products",
        required: true,
        type: Number
    },
    description: {
        required: true,
        type: String
    },
    qty: {
        required: true,
        type: Number
    }

}, { timestamps: true })

module.exports = mongoose.model('CartProducts', productSchema)