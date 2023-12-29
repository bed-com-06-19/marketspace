const express = require ('express');
 const app = express();
 const bodyParser = require('body-parser');
 const morgan =require('morgan');
 const mongoose = require('mongoose');
 const cors = require ('cors');

 require('dotenv/config');

 app.use(cors());
 app.options('*', cors());


//middleware
 app.use(bodyParser.json());
 app.use(morgan('tiny'));

 //routes
 const categoriesRoutes = require('./routes/categories');
 const productsRoutes = require('./routes/products');
 const usersRoutes = require('./routes/users');
 const ordersRoutes = require('./routes/orders');

 const api = process.env.API_URL;
 
 app.use(`${api}/categories`,categoriesRoutes);
 app.use(`${api}/products`,productsRoutes);
 app.use(`${api}/users`,usersRoutes);
 app.use(`${api}/orders`,ordersRoutes);

//database
 mongoose.connect(process.env.CONNECTION_STRING, {
    dbName:'market_database'

 })
 .then(() =>{ 
    console.log('database connection is ready')
 })

 .catch((err)=>{
     console.log(err);
 })
 
 app.listen(5000, () =>{
   
    console.log('server running on port 5000');
 })