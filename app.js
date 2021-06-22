const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./util/appError');
const globalErrorHanlder = require('./controllers/errorControllers')

const app = express();
//We add all the middleware here which will be operating in between 2 tasks


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
/*
  Here in the below line of code "express.json()" is the middleware
  Middleware is just an function that can modify the incoming request data in JSON format.
  So here the express.json() helps to add the data coming to the body of the request
*/
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

//error handlign for wrong URL or that doesn;t exists
app.all('*', (req, res, next) => {
  //METHOD 1
  // res.status(404).json({
  //   status: 'failed',
  //   message: `Can't find ${req.originalUrl}`,
  // });

  //METHOD 2
  //creating an error user defined error created.
  // const err = new Error(`Can't find ${req.originalUrl}`);
  // err.status = 'fail';
  // err.statusCode = 404;

  //express assumes whatever we pass in the next function is the error so it directly executes the error handng middleware eventhough if there is something in the middle of the route
  // next(err);

  //METHOD 3
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});
//this function wil hanlde all the errors if there any error in between of the code.
app.use(globalErrorHanlder);

// specifyig the four argument function in middleware express automatically understands it as the error handling function
// app.use()
module.exports = app;
