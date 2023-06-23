const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    shippingInfo: {
        address: {
            type: String,
            required: [true, 'Enter Address']
        },
        city: {
            type: String,
            required: [true, 'Enter City']
        },
        state: {
            type: String,
            required: [true, 'Enter State']
        },
        country: {
            type: String,
            required: [true, 'Enter Country']
        },
        pincode: {
            type: Number,
            required: [true, 'Enter Pincode']
        },
        phoneNo: {
            type: Number,
            required: [true, 'Enter Phone Number']
        }
    },
    orderItems: [
        {
            name: {
                type: String,
                required: [true, 'Enter Name']
            },
            price: {
                type: Number,
                required: [true, 'Enter Price']
            },
            quantity: {
                type: Number,
                required: [true, 'Enter quantity']
            },
            image: {
                type: String,
                required: [true, 'Enter Image']
            },
            product: {
                type: mongoose.Schema.ObjectId,
                ref: "Product",
                required: true
            },
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    paymentInfo: {
        id: {
            type: String,
            required: [true, 'Enter PaymentInfo']
        },
        status: {
            type: String,
            required: [true, 'Enter Payment Status']
        }
    },
    paidAt: {
        type: Date,
        required: true
    },
    itemsPrice: {
        type: Number,
        default: 0,
        required: true
    },
    taxPrice: {
        type: Number,
        default: 0,
        required: true
    },
    shippingPrice: {
        type: Number,
        default: 0,
        required: true
    },
    totalPrice: {
        type: Number,
        default: 0,
        required: true
    },
    orderStatus: {
        type: String,
        required: true,
        default: 'Processing'
    },
    deliveredAt: Date,
    createdAt:{
        type: Date,
        default: Date.now()
    }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;