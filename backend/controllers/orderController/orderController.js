const { errorResponse, successResponse } = require('../../utils/responseHandler');
const { createOrder, getOrderById } = require('./order.dao');

const newOrder = async (req, res, next) => {
    try {
        const {
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        } = req.body;
        if (!req.body) return res.status(422).send(errorResponse('Unprocessable Entities'));
        let user = req.user._id;
        const orderObj = {
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt: Date.now(),
            user
        }

        const order = await createOrder(orderObj);
        res.status(200).send(successResponse('Added Successfully', {order: order._doc}))
    } catch (e) {
        return res.status(500).send(errorResponse(e))
    }

}

const getOrderDetails = async(req, res,next) => {
    try{
        const orderId = req.params.orderId;
        if(!orderId) return res.status(422).send(errorResponse('Unprocessable Entities'));
        const order = await getOrderById(orderId);
        if(!order) return res.status(404).send(errorResponse('Order Not found'));
        return res.status(200).send(successResponse('Fetched Successfully',{order: order._doc}));

    }catch(e){
        return res.status(500).send(errorResponse(e));
    }
}

module.exports = {
    newOrder,
    getOrderDetails
}