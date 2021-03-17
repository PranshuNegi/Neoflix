const Movie = require('../models/movie');

exports.get_test = (req,res,next) => {
	res.render('watched', {
        pageTitle: 'Watched Movies',
        path: '/watched',
        itlist: [{
        	title: "High School Musical",
        	image: "https://i.pinimg.com/originals/6c/f9/fa/6cf9fa2c8f0cd173857da1ea77047fd3.jpg",
        	date_of_release: "10-08-2006",
        	rating: 5,
        	num_watched: 2,
            rated: false,
            rating: 0,
        	duration: "95 mins",
        	genre: "Musical Drama"}]
    });
};