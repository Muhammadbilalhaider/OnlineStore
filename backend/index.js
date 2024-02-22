const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const mongoDB = require('./config/config');
const router = require('./Route/route');
require('dotenv').config();
const app = express();
app.use(cors());
const MongoUrl = process.env.MONGO_URL;
const PORT = 5000;
app.use(express.json());
app.use('/user', router)
mongoose.connect(MongoUrl)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });
