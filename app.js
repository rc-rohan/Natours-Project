const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//Adding the middleware for the post method to work
/*
  Here in the below line of code "express.json()" is the middleware
  Middleware is just an function that can modify the incoming request data
  So here the express.json() helps to add the data coming to the body of the request
*/
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

// User defined middlewre function

/*
   The sequence of the middleware matters a lot if we declare the middleware after the routes HTTP methods then the middleware will not be considered while calling those routes
 */
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); //toISOString function converts the time to string
  next();
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

module.exports = app;
