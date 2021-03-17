const Movie = require('../models/movie');

exports.get_test = (req,res,next) => {
	res.render('movies', {
        pageTitle: 'All Movies',
        path: '/movies',
        itlist: [{
        	title: "Roohi",
        	image: "https://cdn.dnaindia.com/sites/default/files/styles/full/public/2021/02/16/958005-rajkummarrao-varunsharma-janhvikapoor-roohi-newposter.jpg",
        	date_of_release: "28-02-2021",
        	rating: 4.5,
        	duration: "120 mins",
        	genre: "Horror Comedy"}]
    });
};