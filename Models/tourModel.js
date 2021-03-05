const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Error: Tour name not specified'],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'Error : Atour must have duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Error: A tour mus have a Group Size'],
  },
  difficulty: {
    type: String,
    required: [true, 'Error:Agroup must have a difficulty leve'],
  },
  ratingAverage: {
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
  createAt:{
    type:Date,
    default:Date.now(),
  },
  startDate:[Date]
});

module.exports = mongoose.model('Tour', tourSchema);
