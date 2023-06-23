const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json())
app.use(cookieParser())

//Routes Import
const Product = require('./routes/productRoute');
const User = require('./routes/userRoutes');
const Order = require('./routes/orderRoutes');
const { errorHandler } = require('./utils/errorHandler');

//Middleware for Error
app.use(errorHandler);


//Main Routes
app.use('/api/v1', Product);
app.use('/api/v1', User);
app.use('/api/v1', Order);



module.exports = app;