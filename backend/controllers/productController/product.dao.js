const product = require('../../models/productModel');

const createProduct = (data) => {
    return product.create(data);
}

const getAllProduct = () => {
    return product.find()
}

const getProductById = (productId) => {
    return product.findById(productId);
}

const editProductById = ( productId, productObj ) => {
    return product.findByIdAndUpdate( productId, productObj, {new: true, runValidators: true} )
}

const deleteProductById = ( productId ) => {
    return product.findByIdAndDelete( productId );
}

const getReviews = (productId) => {
    return product.findById(productId).distinct('reviews');
}


module.exports = {
    createProduct,
    getAllProduct,
    getProductById,
    editProductById,
    deleteProductById,
    getReviews
}