/*
  Here we create all the server connection parts
*/
const mongoose = require('mongoose');
//below line is for loading all the variables present in the .env file and using the .env file with the process.env command
require('dotenv').config({ path: './config.env' });
const app = require('./app');

// console.log(process.env);
const DB = process.env.DB_URL;//get the DB URL from process as we have reviously loaded the .env file on the process.

//establishing connection with DB.
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,

    // useFindAndModify: false,
    // useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Database connection successful!'))
  .catch((err) => console.log('Error in connection to DB: ', err));

mongoose.set('useFindAndModify', false); //This line makes sure that we don't get any warning in the console

//Start server
const port = process.env.port || 8000;
//Creating an server at port 3000
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
