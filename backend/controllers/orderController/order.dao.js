const Order = require('../../models/orderModel');

const createOrder = (orderObj) => {
    return Order.create(orderObj)
}

const getOrderById = (orderId) => {
    return Order.findById(orderId).populate('user');
}

module.exports = {
    createOrder,
    getOrderById
}

