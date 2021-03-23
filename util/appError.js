class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational=true//to check whether the error neds to be sent back to the user or the error is due to some internal failure an doesn't needs to be sent to the user

    Error.captureStackTrace(this,this.constructor);//this basically gives the details of where the error occured and in which file the error exists
  }
}

module.exports = AppError