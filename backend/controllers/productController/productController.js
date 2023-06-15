const { createProduct, getAllProduct, editProductById, deleteProductById, getProductById } = require('./product.dao');
const { errorResponse, successResponse } = require('../../utils/responseHandler');
const ApiFeatures = require('../../utils/apiFeatures');


// Create Product ---- Admin

const addProduct = async (req, res) => {
    try {
        let data = req.body;

        if (!data) return res.status(422).send(errorResponse('Unprocessable Entity'));

        const product = await createProduct(data);

        return res.status(201).send(successResponse('Created Successfully', { product }))

    } catch (e) {

        res.status(500).send(errorResponse(e.message))

    }
}


//Get All Products

const getProducts = async (req, res) => {
    try {

        const apiFeature = new ApiFeatures(getAllProduct(),req.query).search().filter();

        const products = await apiFeature.query;

        if (!products) return res.status(404).send(errorResponse('Products Not Found'))

        return res.status(200).send(successResponse('Fetched Successfully', { products }))

    } catch (e) {

        res.status(500).json({ error: e })

    }
}


//Get Product Details

const getProductDetail = async (req, res, next) => {
    try {
        let productId = req.params.productId;

        if (!productId) return res.status(422).send(errorResponse('Unprocessable Entity'));

        const product = await getProductById(productId);

        if (!product) return res.status(404).send(errorResponse('Product Not Found'));

        return res.status(200).send(successResponse('Fetched SuccessFully', { product }))

    } catch (e) {

        res.status(500).send(errorResponse(e.message))
    }
}



//Update Product

const updateProduct = async (req, res) => {
    try {

        let productId = req.params.productId;

        let productObj = req.body;

        if (!productId || !productObj) return res.status(422).send(errorResponse('Unprocessable Entity'));

        let product = await editProductById(productId, productObj);

        if (!product) return res.status(204).send(errorResponse('Updation Failed'));

        return res.status(202).send(successResponse('Updated Successfully',{ product }))

    } catch (e) {

        res.status(500).send(errorResponse(e.message));
    }
}

const deleteProduct = async (req, res) => {
    try {
        let productId = req.params.productId;

        if (!productId) return res.status(422).send(errorResponse('Unprocessable Entity'));

        let product = await deleteProductById(productId);

        if (!product) return res.status(204).send(errorResponse('Deletion Failed'));

        return res.status(200).send(successResponse('Deleted Successfully'));

    } catch (e) {

        res.status(500).send(errorResponse(e.message))
    }
}


module.exports = {
    addProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    getProductDetail
}