const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Error: name is required for every field'],
  },
  email: {
    type: String,
    required: [true, 'Error: user Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter valid email'],
  },
  photo: {
    type: String, //stores the location/path of the image in he file system
    // required: [true, 'Error: user p is required'],
  },
  password: {
    type: String,
    required: [true, 'Enter Password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please enter confirm fields'],
    validate: {
      //this will work only on CREATE and SAVE query
      validator: function (el) {
        //custom validator
        return el === this.password;
      },
      message: 'Confirm Password does not match with Password',
    },
  },
});
//declairing the pre save hook middleware frm mongoose
//it runs between the getting of the data and saving the data to the DB
userSchema.pre('save', async function (next) {
  //isModified is available from mongoose on all the fields
  if (!this.isModified('password')) {
    //this function will run if the password was modified
    return next();
  }
  //hashing the assword
  this.password = await bcrypt.hash(this.password, 12);

  //deleteing the confirm password
  this.passwordConfirm = undefined;
  next();
});

module.exports = mongoose.model('User', userSchema);
