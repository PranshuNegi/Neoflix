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
    .run('MATCH (u:user)- [r:WATCHED]->(m:movie {movieId:$movieid}) WHERE r.rating <> -1 WITH avg(apoc.convert.toInteger(r.rating)) as average_rating MATCH (m:movie {movieId: $movieid})<-[:DIRECTED_IN]-(d:director) MATCH (m:movie {movieId: $movieid})<-[:ACTED_IN]-(a:actor) MATCH (m:movie {movieId: $movieid})-[:OF_GENRE]->(g:genre) RETURN m.title as title, m.released as rl, m.imdbRating as ir, m.duration as dur,  m.poster as poster, m.plot as plt,apoc.coll.toSet(COLLECT(d.name)) as dir, apoc.coll.toSet(COLLECT(a.name)) as act, apoc.coll.toSet(COLLECT(g.name)) as gen, average_rating as avg;',{
        movieid: umovie
    })
    .then(result => {
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
                genre: result.records[0].get('gen'),
                actor: result.records[0].get('act'),
                director: result.records[0].get('dir')}
        });
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