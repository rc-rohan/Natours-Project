/* ALL THE FUNCTIONS RELATED TO AUTHENTICATION OF USER */
const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');

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
      //!some error handling bugs here
      res.status(401).json({
        status: 'Failed',
        message: 'Please Fill the Email and Password Fields.',
      });
      return next();
    }
    // 2/Check if user exits and password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      //!some error handling bugs here
      res.status(401).json({
        status: 'Failed',
        message: 'Provide the valid Email and Password.',
      });
      return next();
    }

    //3. Send the JWT to the client
    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      message: 'successfully authenticcated to the user',
      token,
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: 'authentication falied',
    });
  }
};
