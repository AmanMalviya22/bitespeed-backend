// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const identifyRoute = require('./routes/identify');

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(bodyParser.json());

// mongoose.connect('mongodb://localhost:27017/bitespeed', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false
// }).then(() => {
//   console.log('Connected to MongoDB');
// }).catch(err => {
//   console.error('Failed to connect to MongoDB', err);
// });

// app.use('/identify', identifyRoute);

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });



const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const identifyRoute = require('./routes/identify');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/bitespeed', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

app.use('/identify', identifyRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
