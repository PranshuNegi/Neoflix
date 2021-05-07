const Movie = require('../models/movie');
var neo4j = require('../models/neo4j');
exports.get_test = (req,res,next) => {
    if(user == null){
        res.redirect('/login');
        return
    }
    if(umovie == null){
        res.redirect('/movies');
        return        
    }
    var session = neo4j.session;
    session
    .run('MATCH (u:user)-[r:WATCHED]->(m:movie {movieId:$movieid}) WHERE r.rating <> -1 WITH avg(r.rating) as average_rating,m  RETURN m.title as title, m.released as rl, m.imdbRating as ir, m.duration as dur,  m.poster as poster, m.plot as plt, average_rating as avg;',{
        movieid: umovie
    })
    .then(result => {
    session
    .run('MATCH (m:movie {movieId: $movieid})<-[:DIRECTED_IN]-(d:director) return COLLECT(distinct d.name) as dir;',{
        movieid: umovie
    })
    .then(result2 => {
    session
    .run('MATCH (m:movie {movieId: $movieid})<-[:ACTED_IN]-(a:actor) return COLLECT(distinct a.name) as act;',{
        movieid: umovie
    })
    .then(result3 => {
        session
        .run('MATCH (m:movie {movieId: $movieid})-[:OF_GENRE]->(g:genre),  (u: user {username: $username}) return (case exists((u)-[:WATCHED]->(m)) when true then 1 else 0 end) as wn, COLLECT(distinct g.name) as gen;',{
            movieid: umovie, username: user
    })
        .then(result4 => {
        res.render('details', {
            pageTitle: 'Details',
            path: '/details',
            mdetails: {
                id: umovie,
                title: result.records[0].get('title'),
                image: result.records[0].get('poster'),
                plot: result.records[0].get('plt'),
                date_of_release: result.records[0].get('rl'),
                imdbrating: result.records[0].get('ir'),
                avgrating: result.records[0].get('avg'),
                duration: result.records[0].get('dur'),
                genre: result4.records[0].get('gen'),
                actor: result3.records[0].get('act'),
                director: result2.records[0].get('dir'),
                watched: result4.records[0].get('wn'),}
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
    })
    .catch(error => {
        console.log(error)
    })
};
exports.post_test = (req,res,next) => {
    const btype = req.body.b_type;
    const mid = req.body.movie;
    if( btype == "gb"){
        if(repage == "movies"){
        res.redirect('/movies');}
        else if(repage == "watched"){
        res.redirect('/watched');}
        else if(repage=="recmovies"){
            res.redirect('/recmovies');
        }
        return
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
};