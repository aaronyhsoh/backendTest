const express = require('express')
const app = express()
const v1Routes = require('./routes')
const mongoose = require('mongoose')
require('dotenv').config()
const port = process.env.PORT

mongoose.connect(process.env.MONGO_DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(() => {
  console.log("Connected to database")
})
.catch(err => {
  console.log("Unable to connect to database: ", err);
  process.exit();
});

app.use(express.json())
app.use('/', v1Routes)
app.listen(port, () => { console.log(`Server started on port ${port}`) })

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', '*');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  // res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});