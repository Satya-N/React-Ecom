const express = require('express');
const router = express.Router();
const { getProducts, addProduct, updateProduct, deleteProduct, getProductDetail } = require('../controllers/productController/productController');
const {isAuthenticatedUser, authorizeRole } = require('../middleware/auth');


//Routes

router.get('/products', isAuthenticatedUser, getProducts);
router.post('/addProduct', isAuthenticatedUser,authorizeRole("admin"), addProduct);
router.get('/product/:productId', getProductDetail);
router.patch('/product/:productId', isAuthenticatedUser,authorizeRole("admin"), updateProduct);
router.delete('/product/:productId', isAuthenticatedUser,authorizeRole("admin"), deleteProduct);




module.exports = router;