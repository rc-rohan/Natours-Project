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
  role:{
    type:String,
    enum:['user','guide','lead-guide','admin'],//user defined values
    default:"user",
    // required: [true,"role of the user should be defined"]
  },
  password: {
    type: String,
    required: [true, 'Enter Password'],
    minlength: 8,
    select: false, //this will make sure that this value is tored int eh DB and not show o any user
  },
  passwordConfirm: {
    type: String,

    required: [true, 'Please enter Confirm Password'],
    validate: {
      //this will work only on CREATE and SAVE query
      validator: function (el) {
        //custom validator
        return el === this.password;
      },
      message: 'Confirm Password does not match with Password',
    },
  },
  passwordChangedAt: Date,
});
//declairing the pre save hook middleware from mongoose
//it runs between the getting of the data and saving the data to the DB
userSchema.pre('save', async function (next) {
  //isModified is available from mongoose on all the fields
  if (!this.isModified('password')) {
    //this refer here to the current document ie. users Model
    //return if the password wasn;t modified.
    return next();
  }
  //hashing the password
  this.password = await bcrypt.hash(this.password, 12);

  //deleteing the confirm password as its not required n DB
  this.passwordConfirm = undefined;
  next();
});

//*declaring the instace of the user model
/*
  Since this function is the instace so t is available on all the documents of the userModel.
  here correctPassword is the function name nd the function accepts
    candidatePassword: the passsword that the user enters nto the body.
    userPassword::
    "this" keyword: points to te current document.
    Since the password we have set to false so
    "this.password " won't be accessible here
*/
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000,10);

    // console.log(this.passwordChangedAt, JWTTimestamp);
    return JWTTimestamp<changedTimestamp;
  }


  //FALSE means not changed the password
  return false;
};

module.exports = mongoose.model('User', userSchema);
