const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')


const app = express();

//Adding the middleware for the post method to work
/*
  Here in the below line of code "express.json()" is the middleware
  Middleware is just an function that can modify the incoming request data
  So here the express.json() helps to add the data coming to the body of the request
*/

app.use(morgan('dev'));

app.use(express.json());

// User defined middlewre function
app.use((req, res, next) => {
  console.log('Hello From the middleware');
  //next() func help in going to the next function or the next stage of middleware in the reuest cycle
  next();
});
/*
   The sequence of the middleware matters a lot if we declare the middleware after the routes HTTP methods then the middleware will not be considered while calling those routes
 */
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); //toISOString function converts the tme to string
  next();
});

// creating an post request
app.post('/', (res, req) => {
  res.send('You can post to this endpoint');
});





app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);


module.exports = app;
