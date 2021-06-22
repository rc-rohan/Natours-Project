
/*
  this class is for the error handling this is basically for creating error
  instead we write the

  res.status(404).json({
    status:"fail",
    message:"some mesg",
  });

  writing the above code again and again every where we can use this class to genrate the object of it.
  we can directly use in place of the above function.

  return next(new AppError('message of the error',statusCode));
  next(): as we defined here the middleware at the end that will grab this request.
  new AppError() : this is the instacnce of the class .

*/
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational=true//to check whether the error needs to be sent back to the user or the error is due to some internal failure an doesn't needs to be sent to the user

    Error.captureStackTrace(this,this.constructor);//this basically gives the details of where the error occured and in which file the error exists
  }
}

module.exports = AppError