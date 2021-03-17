const Movie = require('../models/user');

exports.get_test = (req,res,next) => {
	res.render('login', {
        pageTitle: 'Login',
        path: '/login',
        editing: false
    });
};