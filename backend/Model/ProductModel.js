const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
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
        required: true,
        type: Number
    },
    description: {
        required: true,
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Products', productSchema);
