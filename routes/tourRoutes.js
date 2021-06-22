//ALL THE FUNCTION TO REALTED TO API REQUEST THAT HAPPEN
const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require("../controllers/authController");

const router = express.Router();
/*
  Here Router is a middleware and we want this router to use for thi specific route defined
*/

//creating the middleware for id param
// router.param('id', tourController.checkID);

router
  .route('/')
  .get(authController.protectedRoutes,tourController.getAllTours)
  .post(tourController.createTour);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
