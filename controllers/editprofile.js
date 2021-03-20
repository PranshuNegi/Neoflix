const Movie = require('../models/user');

exports.get_test = (req,res,next) => {
	res.render('editprofile', {
        pageTitle: 'Edit Profile',
        path: '/editprofile',
        user: {
        	name: "Pranshu S Negi",
        	age: 20,
        	date_of_birth: "2000-08-01",
        	gender: 0,
        	username: "pranshu"
        },
        genre: ["Romantic","Comedy","Animation","Drama","Action","Thriller","Horror","Biography","Mythological"],
        actor: ["Shah Rukh Khan","Kareena Kapoor","Saif Ali Khan","Anushka Sharma","Hina Khan","Siddharth Malhotra","Alia Bhatt","Rajkumar Rao","Katrina Kaif"],
        editing: true
    });
};