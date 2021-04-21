const Movie = require('../models/user');
var neo4j = require('../models/neo4j');
exports.get_test = (req,res,next) => {
	res.render('login', {
        pageTitle: 'Login',
        path: '/login',
        editing: false
    });
};

exports.post_test = (req,res,next) => {
    const uname = req.body.username;
    const pswd = req.body.password;
    var ps;
    var session = neo4j.session;
    session
        .run('MATCH (u:user {username: $username}) RETURN u.password as psd;', {
        username: uname
        })
        .then(result => {
        result.records.forEach(record => {
        ps = record.get('psd');
        console.log(ps);
        user = uname;
        if(ps == pswd){
            res.redirect('/movies');
        }
        else{
            res.json({ status: 401, message : 'Please enter correct username or password' }) 
        }

        })
        })
        .catch(error => {
        console.log(error)
        res.redirect('/login');
        })
        .then(() => session.close())
};