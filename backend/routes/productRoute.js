const express = require('express');
const router = express.Router();
const { getProducts, addProduct, updateProduct, deleteProduct, getProductDetail, createProductReview, getProductReviews, deleteReview } = require('../controllers/productController/productController');
const {isAuthenticatedUser, authorizeRole } = require('../middleware/auth');


//Routes

router.get('/products', isAuthenticatedUser, getProducts);
router.post('/admin/product/new', isAuthenticatedUser,authorizeRole("admin"), addProduct);
router.get('/product/:productId', getProductDetail);
router.put('/review', isAuthenticatedUser, createProductReview);
router.get('/reviews', getProductReviews);
router.delete('/reviews', isAuthenticatedUser, deleteReview);
router.patch('/admin/product/:productId', isAuthenticatedUser,authorizeRole("admin"), updateProduct);
router.delete('/admin/product/:productId', isAuthenticatedUser,authorizeRole("admin"), deleteProduct);




module.exports = router;