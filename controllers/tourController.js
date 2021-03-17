// const fs = require('fs');
const { query } = require('express');
const Tour = require('../Models/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    //BUILD QUERY
    // 1. FILTERING
    const queryObj = { ...req.query };
    const excludefileds = ['page', 'sort', 'limit', 'fields'];
    excludefileds.forEach((el) => delete queryObj[el]); //delete the elemtns if present

    // 2.) ADVANCE FILTERING
    let queryString = JSON.stringify(queryObj);
    //writing the regular expression for replacing the string values
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    console.log(JSON.parse(queryString));

    const query = Tour.find(JSON.parse(queryString));

    //the above code can be written as Tour
    // const query = Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // *EXECUTE QUERY

    //as further on we will be sorting the above query or doing some task on above query so instead of awaiting for again and again we will await here at the end
    const tours = await query;

    //SEND RESPONSE
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: 'invalid Request',
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    //findByID(req.param.id) === findOne({_id:req.param.id});

    //using jSend data specification where we define the status code with every reponse
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: 'Ivalid request ID',
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    // const newTour = new Tour(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      //we write new to true so that the updated document is the one that will be retured
      new: true,
      runValidators: true, //this will run the validators again on updated data
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    //status code 204 means no content  and the data we sent is null
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      messge: 'Ivalid data',
    });
  }
};
