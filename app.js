
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// const adminRo = require('./routes/ho');
const movies = require('./routes/movies');
const recmovies = require('./routes/recmovies');
const watched = require('./routes/watched');
const adduser = require('./routes/adduser');
const editprofile = require('./routes/editprofile');
const login = require('./routes/login');
const details = require('./routes/details');
const filters = require('./routes/filters');
const results = require('./routes/results');
const users = require('./routes/users');
const mlogin = require('./routes/mlogin');
const addmovie = require('./routes/addmovie');
const addgenre = require('./routes/addgenre');
const addperson = require('./routes/addperson');
const addtag = require('./routes/addtag');
const alogin = require('./routes/alogin');
const pmovie = require('./routes/pmovie');
const pactor = require('./routes/pactor');
const pusers = require('./routes/pusers');
const pgenre = require('./routes/pgenre');
// const pool =  require('./utils/database');
const neo = require('./models/neo4j.js')

const app = express();
global.user = null;
global.umovie = null;
global.repage = null;
global.mlog = false;
global.pswd = "cs387@project";
global.pd = "cs387@analyst";
global.alog = false;

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use('/movies',movies);
app.use('/recmovies',recmovies);
app.use('/watched',watched);
app.use('/adduser',adduser);
app.use('/editprofile',editprofile);
app.use('/',login);
app.use('/login',login);
app.use('/details',details);
app.use('/filters',filters);
app.use('/results',results);
app.use('/users',users);
app.use('/mlogin',mlogin);
app.use('/addmovie',addmovie);
app.use('/addgenre',addgenre);
app.use('/addperson',addperson);
app.use('/addtag',addtag);
app.use('/alogin',alogin);
app.use('/pmovie',pmovie);
app.use('/pactor',pactor);
app.use('/pusers',pusers);
app.use('/pgenre',pgenre);
app.listen(3000);

module.exports = app