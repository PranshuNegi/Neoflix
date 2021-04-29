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
    .run('MATCH (m:movie)-[:OF_GENRE]->(g:genre) ,  (u: user {username: $username})-[r:WATCHED]->(m)  return m.movieId as id, m.title as title, m.poster as poster, m.released as drelease, m.imdbRating as rating, m.duration as dur, COLLECT(g.name) as gen , r.rating as user_rating;',{
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
                user_rating: record.get('user_rating'),
                duration: record.get('dur'),
                genre: record.get('gen')})
        });
        res.render('watched', {
            pageTitle: 'Watched Movies',
            path: '/watched',
            itlist: it
        });
    })
    .catch(error => {
        console.log(error)
    })
};
exports.post_test = (req,res,next)=>{
    const btype = req.body.b_type;
    const mid = req.body.movie;
    if( btype == "md"){
        umovie = mid;
        repage = "watched";
        res.redirect('/details');
    }
    else if(btype == "unstar"){
        var session = neo4j.session;
        session
        .run('MATCH (a:user {username: $username})-[r:WATCHED]->(b:movie {movieId: $movid}) SET r.rating=-1;',{
            username: user, movid: mid
        })
        .then(result => {
            res.redirect('/watched');
        })
        .catch(error => {
            console.log(error)
        })
    }
    else if(btype == "star5"){
        var session = neo4j.session;
        session
        .run('MATCH (a:user {username: $username})-[r:WATCHED]->(b:movie {movieId: $movid}) SET r.rating=5;',{
            username: user, movid: mid
        })
        .then(result => {
            res.redirect('/watched');
        })
        .catch(error => {
            console.log(error)
        })
    }
    else if(btype == "star4"){
        var session = neo4j.session;
        session
        .run('MATCH (a:user {username: $username})-[r:WATCHED]->(b:movie {movieId: $movid}) SET r.rating=4;',{
            username: user, movid: mid
        })
        .then(result => {
            res.redirect('/watched');
        })
        .catch(error => {
            console.log(error)
        })
    }
    else if(btype == "star3"){
        var session = neo4j.session;
        session
        .run('MATCH (a:user {username: $username})-[r:WATCHED]->(b:movie {movieId: $movid}) SET r.rating=3;',{
            username: user, movid: mid
        })
        .then(result => {
            res.redirect('/watched');
        })
        .catch(error => {
            console.log(error)
        })
    }
    else if(btype == "star2"){
        var session = neo4j.session;
        session
        .run('MATCH (a:user {username: $username})-[r:WATCHED]->(b:movie {movieId: $movid}) SET r.rating=2;',{
            username: user, movid: mid
        })
        .then(result => {
            res.redirect('/watched');
        })
        .catch(error => {
            console.log(error)
        })
    }
    else if(btype == "star1"){
        var session = neo4j.session;
        session
        .run('MATCH (a:user {username: $username})-[r:WATCHED]->(b:movie {movieId: $movid}) SET r.rating=1;',{
            username: user, movid: mid
        })
        .then(result => {
            res.redirect('/watched');
        })
        .catch(error => {
            console.log(error)
        })
    }
};
