const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

//Adding the middleware for the post method to work
/*
  Here in the below line of code "express.json()" is the middleware
  Middleware is just an function that can modify the incoming request data
  So here the express.json() helps to add the data coming to the body of the request
*/

app.use(morgan('dev'));

app.use(express.json());

// User defined middlewre function
app.use((req, res, next) => {
  console.log('Hello From the middleware');
  //next() func help in going to the next function or the next stage of middleware in the reuest cycle
  next();
});
/*
   The sequence of the middleware matters a lot if we declare the middleware after the routes HTTP methods then the middleware will not be considered while calling those routes
 */
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); //toISOString function converts the tme to string
  next();
});

//route Handlers

// app.get('/', (req, res) => {
//   //send method sends only the String from the server
//   res.status(200).send('Hello world frfom backend');

//   //json methods sends the data in the form of objct to the client
//   res
//     .status(200)
//     .json({ messge: 'Hello world frfom backend', app: 'Natourous' });

//   res.status(200).send('Hello world frfom backend');
// });

//creating an post request
// app.post('/',(res,req)=>{
//   res.send('You can post to this endpoint');
// })

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
// console.log(tours);
const getAllTours = (req, res) => {
  console.log('Got req');
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};
const getTour = (req, res) => {
  /*
    Here /:id denotes the variable in the parameter and we need to specify its value or elese it will show error
    Inorder to make the variable parameter optional we can use this or /:id?

  */
  console.log('Parameter can be accessed using this', req.params);

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

const createTour = (req, res) => {
  const newId = tours[tours.length() - 1].id + 1;
  const newTour = { id: newId, ...req.body };

  console.log(newTour);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
      //Status Code 201 stands for created
    }
  );
};

const updateTour = (req, res) => {
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

const deleteTour = (req, res) => {
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

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message:"This route is not yet defined"
  });
};

const createUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined',
    });
};

const getUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined',
    });
};

const updateUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined',
    });
};

const deleteUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined',
    });
};

//Routes

// app.get('api/v1/tours', getAllTours);
// app.post('api/v1/tours', createTour);
//the above HTTP methods can also be written as
app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);
// app.patch('api/v1/tours/:id', updateTour);
// app.delete('api/v1/tours/:id', deleteTour);

app.route('/api/v1/users').get(getAllUsers).post(createUser);

app.route('/api/v1/uers/:id').get(getUser).patch(updateUser).delete(deleteUser);

//Start server
const port = 3000;
//Creating an server at port 3000
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
