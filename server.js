require('dotenv').config({ path: './config.env' });

const app = require('./app');

// console.log(process.env);

//Start server
const port = process.env.port || 8000;
//Creating an server at port 3000
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
