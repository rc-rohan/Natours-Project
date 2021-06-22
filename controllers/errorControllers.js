/*
  this is the middleware created at the end and if there is error in between this middleware will
  handle that error.

*/

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else if (process.env.NODE_ENV === 'production') {
    //operational erro that happend due to some user based error
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      //programmming error or some package error so dont't leak the details to the cllient
      console.error('Error 💥', err);

      res.status(500).json({
        status: 'error',
        message: 'Something went very wrong',
      });
    }
  }
};
