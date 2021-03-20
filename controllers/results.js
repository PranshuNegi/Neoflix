const Movie = require('../models/user');

exports.get_test = (req,res,next) => {
	res.render('results', {
        pageTitle: 'Results',
        path: '/results',
        itlist:[{
        	title: "High School Musical",
        	image: "https://i.pinimg.com/originals/6c/f9/fa/6cf9fa2c8f0cd173857da1ea77047fd3.jpg",
        	date_of_release: "10-08-2006",
        	rating: 6,
            watched: true,
        	duration: "95 mins",
        	genre: "Musical Drama"},
        	{
        	title: "High School Musical 2",
            image: "https://m.media-amazon.com/images/M/MV5BNjI5ODI4NTc1MF5BMl5BanBnXkFtZTgwMDg3ODYzMjE@._V1_.jpg",
            date_of_release: "15-08-2007",
            rating: 4,
            watched: false,
            duration: "100 mins",
            genre: "Musical Drama"
        }]
    });
};