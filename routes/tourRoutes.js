//ALL THE FUNCTION TO REALTED TO API REQUEST THAT HAPPEN
const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const router = express.Router();
/*
  Here Router is a middleware and we want this router to use for thi specific route defined
*/

//creating the middleware for id param
// router.param('id', tourController.checkID);

router
  .route('/')
  .get(authController.protectedRoute, tourController.getAllTours)
  .post(tourController.createTour);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protectedRoute,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );
/*here in the delete route we add the protected access that if the useer is logged in
  then only he can delete the tour
  and also we add the restricTo() function that declare that the admin can only delete the
  items.
*/

module.exports = router;
