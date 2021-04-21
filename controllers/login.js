const Movie = require('../models/user');

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
    var neo4j = require('neo4j-driver')
    var driver = neo4j.driver(
        'neo4j://localhost',
        neo4j.auth.basic('neo4j', 'dbislab')
    )
    var session = driver.session({
        database: 'neo4j',
        defaultAccessMode: neo4j.session.WRITE
    })
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
        })
        })
        .catch(error => {
        console.log(error)
        res.redirect('/login');
        })
        .then(() => session.close())
};