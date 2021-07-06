const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;



const productsRoute = require('./routes/products');
const usersRoute = require('./routes/orders');
/* CORS */
app.use(cors({
  origin: '*',
  methods: ['GET', 'PUT', 'DELETE', 'PATCH', 'POST'],
  allowedHeaders: 'Content-Type, Authorization, Origin, X-Requested-With, Accept'
}));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products',productsRoute);
app.use('/api/orders',usersRoute);
app.listen(port,()=>{
  console.log(`App running on port ${port}.`);
});
