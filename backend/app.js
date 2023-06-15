const express = require('express');

const app = express();

app.use(express.json())

//Routes Import
const product = require('./routes/productRoute');
const { errorHandler } = require('./utils/errorHandler');

//Middleware for Error
app.use(errorHandler);


app.use('/api/v1', product)



module.exports = app;