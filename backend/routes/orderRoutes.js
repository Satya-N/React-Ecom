const express = require('express');
const router = express.Router();

const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");
const { newOrder, getOrderDetails } = require('../controllers/orderController/orderController');

router.get("/order/:orderId", isAuthenticatedUser, getOrderDetails);
router.post("/order/new", isAuthenticatedUser, newOrder);



module.exports = router;