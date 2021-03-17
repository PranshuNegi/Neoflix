const Movie = require('../models/user');

exports.get_test = (req,res,next) => {
	res.render('adduser', {
        pageTitle: 'Sign Up',
        path: '/adduser',
        editing: false
    });
};