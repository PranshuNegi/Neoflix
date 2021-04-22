const Movie = require('../models/user');
var neo4j = require('../models/neo4j');
exports.get_test = (req,res,next) => {
	res.render('login', {
        pageTitle: 'Login',
        path: '/login',
        editing: false,
        status: 0
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
        if(result.records.length == 0){
            res.render('login', {
                pageTitle: 'Login',
                path: '/login',
                editing: false,
                status: 401
            });
        }
        result.records.forEach(record => {
        ps = record.get('psd');
        console.log(ps);
        user = uname;
        if(ps == pswd){
            res.redirect('/movies');
        }
        else{
            res.render('login', {
                pageTitle: 'Login',
                path: '/login',
                editing: false,
                status: 401
            });
        }
        })
        })
        .catch(error => {
        console.log(error)
        })
};