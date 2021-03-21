const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Error: Tour name not specified'],
      unique: true,
      trim: true,
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
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Error: Price must be specified for tour'],
    },
    priceDiscount: Number,
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


module.exports = mongoose.model('Tour', tourSchema);
