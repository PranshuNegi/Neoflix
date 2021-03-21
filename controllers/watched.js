const Movie = require('../models/movie');

exports.get_test = (req,res,next) => {
	res.render('watched', {
        pageTitle: 'Watched Movies',
        path: '/watched',
        itlist: [{
        	title: "High School Musical",
        	image: "https://i.pinimg.com/originals/6c/f9/fa/6cf9fa2c8f0cd173857da1ea77047fd3.jpg",
        	date_of_release: "10-08-2006",
        	rating: 6,
            rated: true,
            user_rating: 4,
        	duration: "95 mins",
        	genre: "Musical Drama"},
            {title: "Toy Story",
            image: "https://image.tmdb.org/t/p/w440_and_h660_face/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg",
            plot: "A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",
            date_of_release: "22-11-1995",
            rating: 7.8,
            rated: false,
            duration: "81 mins",
            genre: "Animated Comedy"}]
    });
};