
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const adminRo = require('./routes/admin');
const prods = require('./routes/prods');
const cart = require('./routes/cart');
const orders = require('./routes/orders');
const movies = require('./routes/movies');
const watched = require('./routes/watched');
const adduser = require('./routes/adduser');
const editprofile = require('./routes/editprofile');
const login = require('./routes/login');
const pool =  require('./utils/database');


const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended:true}));
app.use(express.static(path.join(__dirname,'public')));


app.use('/admin',adminRo);
app.use('/prods',prods);
app.use('/movies',movies);
app.use('/watched',watched);
app.use('/cart',cart);
app.use('/orders',orders);
app.use('/adduser',adduser);
app.use('/editprofile',editprofile);
app.use('/login',login);
app.listen(3000);