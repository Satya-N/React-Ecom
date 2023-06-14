const express = require('express');
const router = express.Router();
const { getProducts, addProduct, updateProduct, deleteProduct, getProductDetail } = require('../controllers/productController/productController');


//Routes

router.get('/products', getProducts);
router.post('/addProduct', addProduct);
router.get('/product/:productId', getProductDetail);
router.patch('/product/:productId', updateProduct);
router.delete('/product/:productId', deleteProduct);




module.exports = router;