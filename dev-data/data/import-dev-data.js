/*
  Script to read the entire fie from the JSON file and store it into database

  use the below script to delete data
  node relative_location_of_this_file --delete

  use below script to import data from the JSON
  node relative_location_of_this_file --import
  */
const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });
const Tour = require('../../Models/tourModel');

// console.log(process.env);
const DB = process.env.DB_URL;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Database connection successful!'));

//read JSON file

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

//import data into DB

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully imported');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

//Delete data which is already present in the DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('data successfully deleted');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if(process.argv[2]==='--import'){
  importData();
}else if(process.argv[2]==='--delete'){
  deleteData();
}
