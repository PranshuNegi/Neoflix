const Movie = require('../models/movie');
var neo4j = require('../models/neo4j');
exports.get_test = (req,res,next) => {
	// res.render('recmovies', {
 //        pageTitle: 'Recommended Movies',
 //        path: '/recmovies',
 //        itlist: [{
 //            title: "High School Musical 2",
 //            image: "https://m.media-amazon.com/images/M/MV5BNjI5ODI4NTc1MF5BMl5BanBnXkFtZTgwMDg3ODYzMjE@._V1_.jpg",
 //            date_of_release: "15-08-2007",
 //            rating: 4,
 //            duration: "100 mins",
 //            genre: "Musical Drama"}],
 //        itlist0:  [{
 //            title: "Zero",
 //            image: "https://images.livemint.com/rf/Image-621x414/LiveMint/Period2/2018/12/22/Photos/Processed/zero_film_review-k8AF--621x414@LiveMint.jpg",
 //            date_of_release: "21-12-2018",
 //            rating: 5.4,
 //            watched: false,
 //            duration: "164 mins",
 //            genre: "Romance Comedy"}],
 //        itlist2: [{
 //            title: "Roohi",
 //            image: "https://cdn.dnaindia.com/sites/default/files/styles/full/public/2021/02/16/958005-rajkummarrao-varunsharma-janhvikapoor-roohi-newposter.jpg",
 //            date_of_release: "28-02-2021",
 //            rating: 7,
 //            watched: false,
 //            duration: "120 mins",
 //            genre: "Horror Comedy"}]
 //    });
 if(user == null){
        res.redirect('/login');
        return
    }
    var session = neo4j.session;
    var it = [];
    session
    .run('MATCH (u:user {username : $username})-[:FAV_ACTOR]->(a:actor) MATCH (a:actor)-[:ACTED_IN]->(m:movie) WHERE NOT EXISTS ( (u:user)-[:WATCHED]->(m:movie) ) and exists (m.imdbRating) MATCH (m:movie)-[r:OF_GENRE]->(g:genre) RETURN m.movieId as id ,m.title as title, COLLECT(g.name) as gen, m.poster as poster, m.released as drelease, m.imdbRating as rating, m.duration as dur,0 as wn order by m.imdbRating desc LIMIT 10;',{
        username: user
    })
    .then(result => {
        result.records.forEach(record => {
            it.push({
                id: record.get('id'),
                title: record.get('title'),
                image: record.get('poster'),
                date_of_release: record.get('drelease'),
                rating: record.get('rating'),
                watched: record.get('wn'),
                duration: record.get('dur'),
                genre: record.get('gen')})
        });
        var session2=neo4j.session;
        var it2 = [];
    session2
    .run('MATCH (u:user {username : $username})-[:FAV_GENRE]->(g:genre) MATCH (m:movie)-[:OF_GENRE]->(g:genre) WHERE NOT EXISTS ( (u:user)-[:WATCHED]->(m:movie) ) and exists (m.imdbRating) MATCH (m:movie)-[r:OF_GENRE]->(g:genre) RETURN m.movieId as id ,m.title as title, COLLECT(g.name) as gen, m.poster as poster, m.released as drelease, m.imdbRating as rating, m.duration as dur,0 as wn order by m.imdbRating desc LIMIT 10;',{
        username: user
    })
    .then(result2 => {
        result2.records.forEach(record => {
            it2.push({
                id: record.get('id'),
                title: record.get('title'),
                image: record.get('poster'),
                date_of_release: record.get('drelease'),
                rating: record.get('rating'),
                watched: record.get('wn'),
                duration: record.get('dur'),
                genre: record.get('gen')})
        });
        res.render('recmovies', {
        pageTitle: 'Recommended Movies',
        path: '/recmovies',
        itlist: it2,
        itlist0:  it,
        itlist2: [{
            title: "Roohi",
            image: "https://cdn.dnaindia.com/sites/default/files/styles/full/public/2021/02/16/958005-rajkummarrao-varunsharma-janhvikapoor-roohi-newposter.jpg",
            date_of_release: "28-02-2021",
            rating: 7,
            watched: false,
            duration: "120 mins",
            genre: "Horror Comedy"}]});
    })
    })
    .catch(error => {
        console.log(error)
    })
};