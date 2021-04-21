const Movie = require('../models/movie');

exports.get_test = (req,res,next) => {
    console.log(user);
	res.render('movies', {
        pageTitle: 'All Movies',
        path: '/movies',
        itlist: [{
        	title: "Roohi",
        	image: "https://cdn.dnaindia.com/sites/default/files/styles/full/public/2021/02/16/958005-rajkummarrao-varunsharma-janhvikapoor-roohi-newposter.jpg",
        	date_of_release: "28-02-2021",
        	rating: 7,
            watched: false,
        	duration: "120 mins",
        	genre: "Horror Comedy"},
            {
            title: "Zero",
            image: "https://images.livemint.com/rf/Image-621x414/LiveMint/Period2/2018/12/22/Photos/Processed/zero_film_review-k8AF--621x414@LiveMint.jpg",
            date_of_release: "21-12-2018",
            rating: 5.4,
            watched: false,
            duration: "164 mins",
            genre: "Romance Comedy"},
            {
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
            genre: "Musical Drama"},
            {title: "Toy Story",
            image: "https://image.tmdb.org/t/p/w440_and_h660_face/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg",
            plot: "A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",
            date_of_release: "22-11-1995",
            rating: 7.8,
            watched: true,
            duration: "81 mins",
            genre: "Animated Comedy"}]
    });
};