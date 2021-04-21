
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const adminRo = require('./routes/admin');
const movies = require('./routes/movies');
const recmovies = require('./routes/recmovies');
const watched = require('./routes/watched');
const adduser = require('./routes/adduser');
const editprofile = require('./routes/editprofile');
const login = require('./routes/login');
const details = require('./routes/details');
const filters = require('./routes/filters');
const results = require('./routes/results');
const pool =  require('./utils/database');


const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended:true}));
app.use(express.static(path.join(__dirname,'public')));
// Bind Neo4j to the request
// app.use((req, res, next) => {
//     req.neo4j = require('./models/neo4j')
//     next()
//   })
  // Convert response from neo4j types to native types
// app.use(require('./middleware/neo4j-type-handler'))
  
//   app.use(require('./routes'));
  
  
  // Handle any constraint errors thrown by Neo4j
// app.use(require('./middleware/neo4j-error-handler'))
  
// app.use(function (req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

app.use('/admin',adminRo);
app.use('/movies',movies);
app.use('/recmovies',recmovies);
app.use('/watched',watched);
app.use('/adduser',adduser);
app.use('/editprofile',editprofile);
app.use('/login',login);
app.use('/details',details);
app.use('/filters',filters);
app.use('/results',results);
app.listen(3000);

module.exports = app