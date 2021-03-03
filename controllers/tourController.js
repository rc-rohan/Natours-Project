const fs = require('fs');



const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

exports.getTour = (req, res) => {

  const id = req.params.id * 1; //Converting an string to number by multiplying strign to number

  if (id > tours.length) {
    return res.status(404).json({ status: 'Fail', message: 'Invalid ID' });
  }

  const tour = tours.find((el) => el.id === id);

  //using jSend data specification where we define the status code with every reponse
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length() - 1].id + 1;
  const newTour = { id: newId, ...req.body };

  console.log(newTour);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      //Status Code 201 stands for created new
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    res.send(404).json({
      status: 'Fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Updated tour',
    },
  });
};

exports.deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    res.send(404),
      json({
        status: 'Fail',
        message: 'Invalid ID',
      });
  }
  //status code 204 means no content  and the data we sent is null
  res.send(204).json({
    status: 'success',
    data: null,
  });
};
