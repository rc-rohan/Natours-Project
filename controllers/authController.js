/* ALL THE FUNCTIONS RELATED TO AUTHENTICATION OF USER */
const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
const AppError = require('../util/appError');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(newUser._id);
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
    const token = signTovcvcken(user._id);

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

    return next(new AppError('Atuthentication Failed',401));

  }
};

// authentication for the protected routes
exports.protectedRoutes = async (req, res, next) => {
  try {
    //1. Getting th tokken from the user and check if it exists
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      //authrization start with the Bearer keyword
      token = req.headers.authorization.split(' ')[1];
    }
    console.log(token);
    if (!token) {
      return next(new AppError('you are not legged in', 401));
    }
    //2. Varification of token

    next();
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: 'user not authorised for accessing this route',
    });
  }
};
