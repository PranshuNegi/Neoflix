const Movie = require('../models/user');
var neo4j = require('../models/neo4j');
exports.get_test = (req,res,next) => {
    user = null;
	res.render('mlogin', {
        pageTitle: 'Manager',
        path: '/mlogin',
        status: 0
    });
};

exports.post_test = (req,res,next) => {
    const paswd = req.body.password;
    if(paswd == pswd){
        mlog = true;
        res.redirect('/addmovie');
    }
    else{
        res.render('mlogin', {
            pageTitle: 'Manager',
            path: '/mlogin',
            status: 404
        });
    }
};