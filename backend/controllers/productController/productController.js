const { createProduct, getAllProduct, editProductById, deleteProductById, getProductById, getReviews } = require('./product.dao');
const { errorResponse, successResponse } = require('../../utils/responseHandler');
const ApiFeatures = require('../../utils/apiFeatures');
const Product = require('../../models/productModel');


// Create Product ---- Admin

const addProduct = async (req, res) => {
    try {

        req.body.user = req.user.id;

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

        const resultPerPage = 5;
        const productCount = await Product.countDocuments();

        const apiFeature = new ApiFeatures
            (getAllProduct(), req.query)
            .search()
            .filter()
            .pagination(resultPerPage)
            ;

        const products = await apiFeature.query;

        if (!products) return res.status(404).send(errorResponse('Products Not Found'))

        return res.status(200).send(successResponse('Fetched Successfully', { products, productCount }))

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

        return res.status(202).send(successResponse('Updated Successfully', { product }))

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

//Create New or Update The REVIEW
const createProductReview = async (req, res, next) => {
    try {
        const { rating, comment, productId } = req.body;
        const review = {
            user: req.user.id,
            name: req.user.name,
            rating: Number(rating),
            comment
        }

        const product = await getProductById(productId);

        const isReviewed = product.reviews.find(
            rev => rev.user.toString() === req.user._id.toString()
        )

        if (isReviewed) {
            product.reviews.map((rev) => {
                if (rev.user.toString() === req.user._id.toString()) {
                    rev.rating = rating,
                        rev.comment = comment
                }
            })
        } else {
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length
        }
        let avg = 0;
        product.ratings = product.reviews.map((rev) => {
            avg = avg + rev.rating;
        })

        product.ratings = avg / product.reviews.length;

        await product.save({ validateBeforeSave: false });

        res.status(200).send(successResponse('Review Added'));

    } catch (e) {
        res.status(500).send(errorResponse('Something Went Wrong'));
    }
}


const getProductReviews = async (req, res, next) => {
    try {
        const productId = req.query.productId;
        const product = await getProductById(productId);
        if (!product) return res.status(404).send(errorResponse('Product Not Found'));
        let reviews = product.reviews;
        res.status(200).send(successResponse('Reviews Fetched Successfully', { reviews }))
    } catch (e) {
        res.status(500).send(errorResponse('Something Went Wrong'))
    }
}

const deleteReview = async (req, res, next) => {
    try {
        const productId = req.query.productId;
        const reviews = await getReviews(productId);
        const filteredReview = reviews.filter(rev => rev._id.toString() !== req.query.id.toString())
        let avg = 0;
        filteredReview.map((rev) => {
            avg = avg + rev.rating;
        })
        const ratings = avg / filteredReview.length;

        const numOfReviews = filteredReview.length;
        let newProductObj = {
            reviews: filteredReview,
            ratings,
            numOfReviews
        }

        let allReviews = await editProductById(productId, newProductObj)

        return res.status(200).send(successResponse('Deleted Successfully'))
    } catch (e) {
        res.status(500).send(errorResponse(e ? e : 'Something Went Wrong'))
    }

}



module.exports = {
    addProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    getProductDetail,
    createProductReview,
    getProductReviews,
    deleteReview
}