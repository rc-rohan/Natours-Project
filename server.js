/*
  Here we create all the server connection parts
*/
const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });//this is for using the .env file with the process.env

const app = require('./app');

// console.log(process.env);
const DB = process.env.DB_URL;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Database connection successful!'));

//Start server
const port = process.env.port || 8000;
//Creating an server at port 3000
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
