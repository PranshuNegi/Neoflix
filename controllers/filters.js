const Movie = require('../models/user');
var neo4j = require('../models/neo4j');
var genre_list = [];
var actor_list = [];
var director_list = [];
exports.get_test = (req,res,next) => {
    if(user == null){
        res.redirect('/login');
        return
    }
    genre_list = [];
    actor_list = [];
    director_list = [];
    var session = neo4j.session;
    session
    .run('MATCH (g:genre) where g.name <> "(no genres listed)" return g.name AS name;',{
    
    })
    .then(result => {
        result.records.forEach(record => {
                genre_list.push(record.get('name'));
        })  
        session
    .run('MATCH (g:actor) return g.name AS name;',{
    
    })
    .then(result2 => {
        result2.records.forEach(record2 => {
                actor_list.push(record2.get('name'));
        }) 
        session
    .run('MATCH (g:director) return g.name AS name;',{
    
    })
    .then(result3 => {
        result3.records.forEach(record3 => {
                director_list.push(record3.get('name'));
        }) 
        res.render('filters', {
            status: 0,
            pageTitle: 'Filters',
            path: '/filters',
            editing: false,
            genre: genre_list,
            actor: actor_list,
            director: director_list,
            fgenre : [],
        
        });       
    })
    .catch(error => {
        console.log(error)
    })         
    })
    .catch(error => {
        console.log(error)
    })        
    })
    .catch(error => {
        console.log(error)
    })    
};
exports.post_test = (req,res,next) => {
    var fgenre = req.body.genre;
    var factor = req.body.actor;
    var fdirector = req.body.director;
    var low = req.body.low;
    var high = req.body.high;
    if(typeof(fgenre)=="string"){
        fgenre = [fgenre];
    }
    else if(fgenre==undefined){
        fgenre = genre_list;
    }
    if(typeof(factor)=="string"){
        factor = [factor];
    }
    else if(factor==undefined){
        factor = actor_list;
    }
    if(typeof(fdirector)=="string"){
        fdirector = [fdirector];
    }
    else if(fdirector==undefined){
        fdirector = director_list;
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
    .run('MATCH (m:movie)-[:OF_GENRE]->(g:genre), \
    (m:movie)<-[:ACTED_IN]-(a:actor), (m:movie)<-[:DIRECTED_IN]-(d:director),\
     (u: user {username: $username}) where g.name in $filter_genre and \
     a.name in $filter_actor and d.name in $filter_director and \
     toInteger($lower) <= toInteger(m.imdbRating) <= toInteger($higher) \
     and g.name <> "(no genres listed)" return distinct m.movieId as id,\
      m.title as title, m.poster as poster, m.released as drelease, m.imdbRating as rating,\
       m.duration as dur, COLLECT(distinct g.name) as gen , \
       (case exists((u)-[:WATCHED]->(m)) when true then 1 else 0 end) as wn LIMIT 25;',{
        username: user, lower: low, higher: high, filter_genre: fgenre, filter_actor: factor, filter_director: fdirector
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