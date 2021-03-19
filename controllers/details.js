const Movie = require('../models/movie');

exports.get_test = (req,res,next) => {
	res.render('details', {
        pageTitle: 'Details',
        path: '/details',
        mdetails: {
            id: 1,
        	title: "Toy Story",
        	image: "https://image.tmdb.org/t/p/w440_and_h660_face/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg",
            plot: "A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",
        	date_of_release: "22-11-1995",
        	rating: 8.3,
        	duration: "81 mins",
        	genre: "Animated Comedy",
            actor: ["Woody", "Buzz Lighyear","Mr. Potato Head","Slinky Dog","Rex","Hamm","Bo Peep","Andy","Sid"],
            director: ["John Lasseter"]}
    });
};