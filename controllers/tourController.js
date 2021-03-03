const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
  console.log(`Checking the validity for ID->${val}`);
  if (req.params.id * 1 > tours.length) {
    /* we add here return statement as we want to terminate here the request and
     don't go to next() middleware in the stack and as that will run and that will also
     send the request headers and thus there will be error as we can send only one
     request headers */
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID',
    });
  }
  //if there is valid call with valid ID
  next();
};

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
  const id =  req.params.id*1;
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
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Updated tour',
    },
  });
};

exports.deleteTour = (req, res) => {
  //status code 204 means no content  and the data we sent is null
  res.send(204).json({
    status: 'success',
    data: null,
  });
};
