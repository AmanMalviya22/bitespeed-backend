const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const identifyRouter = require('./routes/identify'); // Adjust the path as necessary
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/identify', identifyRouter);

mongoose.connect('mongodb://localhost:27017/bitespeed', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(port, () => console.log(`App running on port ${port}`)))
  .catch(err => console.error(err));
