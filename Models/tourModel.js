const mongoose = require('mongoose')

const tourSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Error: Tour name not specified'],
    unique: true,
  },
  rating: { type: Number, default: 4.5 },
  price: {
    type: Number,
    required: [true, 'Error: Price must be specified for tour'],
  },
});

module.exports = mongoose.model('Tour',tourSchema);

