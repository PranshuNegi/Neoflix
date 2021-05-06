const Movie = require('../models/user');
var neo4j = require('../models/neo4j');
var genre_list = [];
var actor_list = [];
var director_list = [];
var tag_list = [];
exports.get_test = (req,res,next) => {    
    if(!mlog){
        res.redirect('\mlogin');
        return;
    }
    genre_list = [];
    actor_list = [];
    director_list = [];
    tag_list = [];
    var session = neo4j.session;
    session
    .run('MATCH (g:genre) where g.name <> "(no genres listed)" return g.name AS name;',{
    
    })
    .then(result => {
        result.records.forEach(record => {
                genre_list.push(record.get('name'));
        
        })
        session
        .run('MATCH (a:person :actor) RETURN a.name AS name;',{
        
        })
        .then(result2 => {
            result2.records.forEach(record2 => {
                actor_list.push(record2.get('name'));
            })
            session
            .run('MATCH (a:person :director) RETURN a.name AS name;',{
        
            })
            .then(result3 => {
                result3.records.forEach(record3 => {
                    director_list.push(record3.get('name'));
                })
            session
            .run('MATCH (a:tag) RETURN a.name AS name;',{
        
            })
            .then(result4 => {
                result4.records.forEach(record4 => {
                    tag_list.push(record4.get('name'));
                })
            res.render('addmovie', {
                status: 0,
                pageTitle: 'Add Movie',
                path: '/addmovie',
                editing: false,
                genre: genre_list,
                actor: actor_list,
                director: director_list,
                tags: tag_list,
                fgenre: [],
                factor: []
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
    var mid = req.body.movid;
    var session2=neo4j.session;
    session2.run('MATCH (m:movie) return max(toInteger(m.movieId))+1 as mid;').then(resultMid=>{
        
        // console.log(movieId);
        if(btype == "add"){
        mid=resultMid.records[0].get('mid').toString();        
        const title = req.body.title;
        const plot = req.body.plot;
        const duration = req.body.duration;
        const language = req.body.language;
        const poster = req.body.poster;
        const imdb = req.body.imdb;
        const dor = req.body.date_of_release;
        var genre = req.body.genre;
        var actor = req.body.actor;
        var director = req.body.director;
        var tags = req.body.tags;
        var relevance = req.body.relevance;
        var session = neo4j.session;
        session
        .run('MATCH (n:movie {movieId: $mmid}) RETURN n.movieId as pd;', {
            mmid: mid
            })
            .then(result => {
                if(result.records.length == 0){
                    if(title == null || title == ""){
                        res.render('addmovie', {
                            status: 404,
                            pageTitle: 'Add Movie',
                            path: '/addmovie',
                            editing: false,
                            genre: genre_list,
                            actor: actor_list,
                            director: director_list,
                            tags: tag_list,
                            fgenre: [],
                            factor: [],
                            bt: "add",
                            pn: mid
                        }); 
                    }
                    else{
                        var session = neo4j.session;
                        session.run('CREATE (m:movie {movieId: $a1, duration: $a2, plot: $a3, title: $a4, poster: $a5, released: $a6, imdbRating: $a7, language: $a8})', {
                            a1: mid, a2: duration, a3: plot, a4: title, a5: poster, a6: dor, a7: imdb, a8:  language
                            })
                            .then(result => {
                                if(typeof(genre)=="string"){
                                    genre = [genre]
                                }
                                else if(genre==undefined){
                                    genre=[]
                                }
                                session.run('MATCH (m:movie {movieId: $mmid}) MATCH (g:genre) WHERE g.name in $lis MERGE (m)-[:OF_GENRE]->(g);', {
                                    mmid:mid, lis:genre
                                })
                                .then(result => {
                                    if(typeof(actor)=="string"){
                                        actor = [actor]
                                    }
                                    else if(actor==undefined){
                                        actor=[]
                                    }
                                    session.run('MATCH (m:movie {movieId: $mmid}) MATCH (g:actor) WHERE g.name in $lis MERGE (g)-[:ACTED_IN]->(m);', {
                                        mmid:mid, lis:actor
                                    })
                                    .then(result => {
                                        if(typeof(director)=="string"){
                                            director = [director]
                                        }
                                        else if(director==undefined){
                                            director=[]
                                        }
                                        session.run('MATCH (m:movie {movieId: $mmid}) MATCH (g:director) WHERE g.name in $lis MERGE (g)-[:DIRECTED_IN]->(m);', {
                                            mmid:mid, lis:director
                                        })
                                        .then(result => {
                                            var rel_list = relevance.split(",")
                                            if(tags.length!=rel_list.length || tags.length > 2 || tags.length < 2){
                                                res.render('addmovie', {
                                                    status: 403,
                                                    pageTitle: 'Add Movie',
                                                    path: '/addmovie',
                                                    editing: false,
                                                    genre: genre_list,
                                                    actor: actor_list,
                                                    director: director_list,
                                                    tags: tag_list,
                                                    fgenre: [],
                                                    factor: [],
                                                    bt: "add",
                                                    pn: mid
                                                });
                                                return
                                            }
                                            for(var k=0; k<rel_list.length; k++ ){
                                                rel_list[k] = parseFloat(rel_list[k])
                                                if(rel_list[k]>1 || rel_list[k]<=0){
                                                    res.render('addmovie', {
                                                        status: 403,
                                                        pageTitle: 'Add Movie',
                                                        path: '/addmovie',
                                                        editing: false,
                                                        genre: genre_list,
                                                        actor: actor_list,
                                                        director: director_list,
                                                        tags: tag_list,
                                                        fgenre: [],
                                                        factor: [],
                                                        bt: "add",
                                                        pn: mid
                                                    });
                                                    return
                                                }
                                            }
                                            session.run('MATCH (m:movie {movieId: $mmid}) MATCH (g:tag {name: $lis}) MERGE (m)-[:HAS_TAG {scores: $lis2}]->(g);', {
                                                mmid:mid, lis:tags[0], lis2: rel_list[0]
                                            })
                                            .then(result => {
                                                session.run('MATCH (m:movie {movieId: $mmid}) MATCH (g:tag {name: $lis}) MERGE (m)-[:HAS_TAG {scores: $lis2}]->(g);', {
                                                    mmid:mid, lis:tags[1], lis2: rel_list[1]
                                                })
                                                .then(result => {})
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
                                })
                                .catch(error => {
                                    console.log(error)
                                })
                            })
                            .catch(error => {
                                console.log(error)
                            })
                            res.render('addmovie', {
                                status: 1,
                                pageTitle: 'Add Movie',
                                path: '/addmovie',
                                editing: false,
                                genre: genre_list,
                                actor: actor_list,
                                director: director_list,
                                tags: tag_list,
                                fgenre: [],
                                factor: [],
                                bt: "add",
                                pn: mid
                            }); 
                     return;
                    }
                }
                else{
                    res.render('addmovie', {
                        status: 403,
                        pageTitle: 'Add Movie',
                        path: '/addmovie',
                        editing: false,
                        genre: genre_list,
                        actor: actor_list,
                        director: director_list,
                        tags: tag_list,
                        fgenre: [],
                        factor: [],
                        bt: "add",
                        pn: mid
                    });
                }
            })
            .catch(error => {
                console.log(error)
            })
            
        return
    }
    else{
        var session = neo4j.session;
        session
        .run('MATCH (n:movie {title: $mmid}) RETURN n.movieId as pd;',{
            mmid: mid
        })
        .then(result => {
            if(result.records.length == 0){
                res.render('addmovie', {
                    status: 404,
                    pageTitle: 'Add Movie',
                    path: '/addmovie',
                    editing: false,
                    genre: genre_list,
                    actor: actor_list,
                    director: director_list,
                    tags: tag_list,
                    fgenre: [],
                    factor: [],
                    bt: "del",
                    pn: mid
                });
                    return;
                }
                else{
                    var session = neo4j.session;
                    session
                    .run('MATCH (m:movie {title: $mmid}) DETACH DELETE m',{
                        mmid: mid
                    })
                    .then(result => {
                        res.render('addmovie', {
                            status: 1,
                            pageTitle: 'Add Movie',
                            path: '/addmovie',
                            editing: false,
                            genre: genre_list,
                            actor: actor_list,
                            director: director_list,
                            tags: tag_list,
                            fgenre: [],
                            factor: [],
                            bt: "del",
                            pn: mid
                        }); 
                    })
                    .catch(error => {
                        console.log(error)
                    })
                }
        })
        .catch(error => {
            console.log(error)
        })
    }
    });
    
    
};