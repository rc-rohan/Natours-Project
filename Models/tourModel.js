const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator')

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Error: Tour name not specified'],
      unique: true,
      trim: true,
      maxlength: [
        40,
        'Tour name must have name less than or equal to 40 characters',
      ],
      minlength: [
        10,
        'Tour name must have name less than or equal to 10 characters',
      ],
      // validate:[validator.isAlpha,"tour name must only contain characters"]
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'Error : A tour must have duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Error: A tour mus have a Group Size'],
    },
    difficulty: {
      type: String,
      required: [true, 'Error:Agroup must have a difficulty leve'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating shouldn't be less than 1.0"],
      max: [5, "Ratings shoudln't be greater than 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Error: Price must be specified for tour'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        //this function will not run upon update query
        validator: function (value) {
          //this here points to current doc on NEW document creation
          return value < this.price; //100<200
        },
        message:"Error: The discount price is more than normal price"
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'Error: Atour must have desciption'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'Error: A tour must have an cover image'],
    },
    images: [String],
    createAt: {
      type: Date,
      default: Date.now(),
      select: false, //will never be sent in any of the request
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    //here we are making the virtuals to be present in the output whenever the request is send as JSON or in the Object form
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//DOCUMENT middleware: runs before the .save() command and .create() command not before .insertMany()
tourSchema.pre('save', function (next) {
  //here "this" keyword refers to the document which is currently processed
  // console.log(this);

  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY Middleware:
//  tourSchema.pre('find',function(next){
tourSchema.pre('/^find/', function (next) {
  // /^find/ means all the string that starts with find
  //"this" keyword here points tot he query not to the document as here we are processing the query

  this.find({ secretTour: { $ne: true } });

  next();
});

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  //this.pipeline() consists of all the function that we pass in the aggregate query

  next();
});

module.exports = mongoose.model('Tour', tourSchema);
