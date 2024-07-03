const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const identifyRouter = require('./routes/identify'); // Adjust the path as necessary
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/identify', identifyRouter);
app.get('/', (req, res) => {
    res.send(`<h1 style="color:red">Hello, this is the Bitespeed Backend API!</h1>`);
  });

mongoose.connect('mongodb+srv://aman:a#1009998@A@bitespeed.xau2fam.mongodb.net/?retryWrites=true&w=majority&appName=bitespeed', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(port, () => console.log(`App running on port ${port}`)))
  .catch(err => console.error(err));
