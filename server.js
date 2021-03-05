const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

const app = require('./app');

// console.log(process.env);
const DB = process.env.DB_URL;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => console.log('Database connection successful!'));


//Start server
const port = process.env.port || 8000;
//Creating an server at port 3000
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
