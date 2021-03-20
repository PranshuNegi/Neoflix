const Movie = require('../models/user');

exports.get_test = (req,res,next) => {
	res.render('adduser', {
        pageTitle: 'Sign Up',
        path: '/adduser',
        editing: false,
        genre: ["Romantic","Comedy","Animation","Drama","Action","Thriller","Horror","Biography","Mythological"],
        actor: ["Shah Rukh Khan","Kareena Kapoor","Saif Ali Khan","Anushka Sharma","Hina Khan","Siddharth Malhotra","Alia Bhatt","Rajkumar Rao","Katrina Kaif"]
    });
};