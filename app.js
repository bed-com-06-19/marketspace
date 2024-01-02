const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./helpers/jwt.js');
const errorHandler = require('./helpers/error-handler.js');


require('dotenv').config();

app.use(cors());
app.options('*', cors());

// Middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt()); // Note the parentheses to invoke the middleware function
app.use(errorHandler); // No parentheses here

// Routes
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');

const api = process.env.API_URL;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

// Database
mongoose.connect(process.env.CONNECTION_STRING, {
  dbName: 'market_database',
})
  .then(() => {
    console.log('Database connection is ready');
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
