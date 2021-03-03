const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();
/*
  Here Router is a middleware and we want this router to use for thi specific route defined
*/

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
