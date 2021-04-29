const Movie = require('../models/movie');
var neo4j = require('../models/neo4j');
exports.get_test = (req,res,next) => {
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
// MATCH ( u : user { username : $username })-[ r : WATCHED ]->( m : movie ) WITH u , avg ( r . rating ) AS mean MATCH ( u )-[ r : WATCHED ]->( m : movie )-[: OF_GENRE ]->( g : genre ) WHERE r . rating >= mean WITH u , g , COUNT (*) AS score MATCH ( g )<-[: OF_GENRE ]-( m1 : movie ) WHERE NOT EXISTS (( u )-[: WATCHED ]->( m1 )) and exists(m1.imdbRating) RETURN m1.movieId as id ,m1.title as title, m1.poster as poster, m1.released as drelease, m1.imdbRating as rating, m1.duration as dur, COLLECT ( DISTINCT g.name ) as gen , SUM ( score ) AS score1, 0 as wn ORDER BY score1 DESC, m1.imdbRating DESC LIMIT 10

//