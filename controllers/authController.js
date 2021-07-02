/* ALL THE FUNCTIONS RELATED TO AUTHENTICATION OF USER */

//util is the node.js inbuilt package and we sue here promisify function from there.
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
const AppError = require('../util/appError');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

//SIGN UP Code
exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role:req.body.role,
    });

    const token = signToken(newUser._id);
    console.log(newUser);
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    console.log('Error in creating new User: => ', error);
    res.status(404).json({
      status: 'failed',
      message: error,
    });
  }
};

//SIGN IN CODE
exports.singin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // 1.Check if Email and passwords exits
    if (!email || !password) {
      return next(new AppError('Please fill both fileds', 401));
    }
    // 2/Check if user exits and password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(
        new AppError("User doen't exits check password and email", 401)
      );
    }

    //3. Send the JWT to the client
    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      message: 'successfully authenticcated to the user',
      token,
    });
  } catch (error) {
    //instead of writing this code again and again we can use the app error class.
    // res.status(404).json({
    //   status: 'failed',
    //   message: 'authentication falied' + error,
    // });

    return next(new AppError('Atuthentication Failed', 401));
  }
};

// authentication for the protected routes
exports.protectedRoute = async (req, res, next) => {
  try {
    //1. Getting th tokken from the user and check if it exists
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      //authorization start with the "Bearer" keyword
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return next(new AppError('you are not legged in', 401));
    }
    //2. Verification of token

    //here we will verify the token sent from the client and then allow him to proceed forward.
    // verfication is done using the "SECRET_KEY" and "token".
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // console.log(decoded);

    //3. Checking if  user still exists

    /* In case user logged in and then deleted the account and then trying to access the
      private routes or someone else got the access to the token
    */
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token no longer exists.', 401)
      );
    }

    // 4. Check if the user changed the password after the token was issued.

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      //if the password was changed.
      //we can also return an error or we can simply genrate new token and then send to the user.
      return next(
        new AppError('User recently changed password. Please login again', 401)
      );
    }

    //if all the above steps are verified successfully then allow the user to the protected routes.
    req.user = currentUser;
    next();
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: 'user not authorised for accessing this route',
    });
  }
};

/* Since a middleware cannot have the arguments in the function
  so here we will create the closure which says that a function always has access to its
  parent function argument.
*/
exports.restrictTo = (...roles)=>{
  console.log(roles);
  return (req,res,next) =>{
    /*
      since the roles argument is array and it only consits of the ['admin'] so if any other
      user role wants to access the delete route of tour then that will not be allowed.
     */
    /* //! some Errors here    Always this code is only executed.*/
    if(!roles.includes(req.user.role)){
      return next(
        new AppError("You don't have premission to perform this action ",403)
      )
    }
    next();
  }
}
