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
    .run('MATCH (m:movie)-[:OF_GENRE]->(g:genre) ,  (u: user {username: $username}) where g.name <> "(no genres listed)" return m.movieId as id, m.title as title, m.poster as poster, m.released as drelease, m.imdbRating as rating, m.duration as dur, COLLECT(g.name) as gen , (case exists((u)-[:WATCHED]->(m)) when true then 1 else 0 end) as wn LIMIT 25;',{
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
        res.render('movies', {
            pageTitle: 'All Movies',
            path: '/movies',
            itlist: it
        });
    })
    .catch(error => {
        console.log(error)
    })
};

exports.post_test = (req,res,next) => {
    const btype = req.body.b_type;
    const mid = req.body.movie;
    if( btype == "md"){
        umovie = mid;
        repage = "movies";
        res.redirect('/details');
    }
    else if(btype == "wa"){
        var session = neo4j.session;
        session
        .run('MATCH (a:user {username: $username}), (b:movie {movieId: $movid}) CREATE (a)-[r:WATCHED {rating: -1}]->(b)',{
            username: user, movid: mid
        })
        .then(result => {
            res.redirect('/watched');
        })
        .catch(error => {
            console.log(error)
        })
        
    }
    else{
        var session = neo4j.session;
        session
        .run('MATCH (u:user {username: $username}) MATCH (m:movie {movieId: $movid}) MERGE (u)-[:WATCHED {rating: -1}]->(m);',{
            username: user, movid: mid
        })
        .then(result => {
            res.redirect('/movies');
        })
        .catch(error => {
            console.log(error)
        })
    }
};
