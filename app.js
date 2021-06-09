const express = require('express');
const app = express();
const morgan = require('morgan');
const createError = require("http-errors");
require("dotenv").config();
require('./helpers/db-connection')();
const port = process.env.PORT || 3000;
const errorHandler = require('./error/ErrorHandler');
const userRoute = require('./users/user.route');

app.use(express.json())
app.use(morgan('combined'));
// routes
app.use('/auth', userRoute);


app.use((req, res, next) => {
    next(new createError.NotFound());
});

app.use(errorHandler);

app.listen(port, () => console.log(`App is running on port ${port} 🚀`));