const Movie = require('../models/user');
var neo4j = require('../models/neo4j');
var genre_list = [];
exports.get_test = (req,res,next) => {
    if(user == null){
        res.redirect('/login');
        return
    }
    genre_list = [];
    var session = neo4j.session;
    session
    .run('MATCH (g:genre) where g.name <> "(no genres listed)" return g.name AS name;',{
    
    })
    .then(result => {
        result.records.forEach(record => {
                genre_list.push(record.get('name'));
        
        })
        res.render('filters', {
            status: 0,
            pageTitle: 'Filters',
            path: '/filters',
            editing: false,
            genre: genre_list,
            fgenre : [],

        });
    })
    .catch(error => {
        console.log(error)
    })    
};
exports.post_test = (req,res,next) => {
    var fgenre = req.body.genre;
    var low = req.body.low;
    var high = req.body.high;
    if(typeof(fgenre)=="string"){
        fgenre = [fgenre];
    }
    else if(fgenre==undefined){
        fgenre = genre_list;
    }
    if(low == ""){
        low = "0"
    }
    if(high == ""){
        high = "10"
    }
    var session = neo4j.session;
    var it = [];
    session
    .run('MATCH (m:movie)-[:OF_GENRE]->(g:genre) ,  (u: user {username: $username}) where g.name in $filter_genre and toInteger($lower) <= toInteger(m.imdbRating) <= toInteger($higher) and g.name <> "(no genres listed)" return distinct m.movieId as id, m.title as title, m.poster as poster, m.released as drelease, m.imdbRating as rating, m.duration as dur, COLLECT(g.name) as gen , (case exists((u)-[:WATCHED]->(m)) when true then 1 else 0 end) as wn LIMIT 25;',{
        username: user, lower: low, higher: high, filter_genre: fgenre
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
            itlist: it,
            remove: true
        });
    })
    .catch(error => {
        console.log(error)
    })
};