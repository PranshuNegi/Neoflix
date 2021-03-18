const Movie = require('../models/movie');

exports.get_test = (req,res,next) => {
	res.render('recmovies', {
        pageTitle: 'Recommended Movies',
        path: '/recmovies',
        itlist: [{
            title: "High School Musical 2",
            image: "https://m.media-amazon.com/images/M/MV5BNjI5ODI4NTc1MF5BMl5BanBnXkFtZTgwMDg3ODYzMjE@._V1_.jpg",
            date_of_release: "15-08-2007",
            rating: 4,
            duration: "100 mins",
            genre: "Musical Drama"}]
    });
};