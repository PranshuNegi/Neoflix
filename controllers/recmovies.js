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
            genre: "Musical Drama"}],
        itlist0:  [{
            title: "Zero",
            image: "https://images.livemint.com/rf/Image-621x414/LiveMint/Period2/2018/12/22/Photos/Processed/zero_film_review-k8AF--621x414@LiveMint.jpg",
            date_of_release: "21-12-2018",
            rating: 5.4,
            watched: false,
            duration: "164 mins",
            genre: "Romance Comedy"}],
        itlist2: [{
            title: "Roohi",
            image: "https://cdn.dnaindia.com/sites/default/files/styles/full/public/2021/02/16/958005-rajkummarrao-varunsharma-janhvikapoor-roohi-newposter.jpg",
            date_of_release: "28-02-2021",
            rating: 7,
            watched: false,
            duration: "120 mins",
            genre: "Horror Comedy"}]
    });
};