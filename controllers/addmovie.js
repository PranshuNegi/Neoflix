const Movie = require('../models/user');
var neo4j = require('../models/neo4j');
var genre_list = [];
var actor_list = [];
var director_list = [];
exports.get_test = (req,res,next) => {    
    if(!mlog){
        res.redirect('\mlogin');
        return;
    }
    genre_list = [];
    actor_list = [];
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
            res.render('addmovie', {
                status: 0,
                pageTitle: 'Add Movie',
                path: '/addmovie',
                editing: false,
                genre: genre_list,
                actor: actor_list,
                director: director_list,
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
	
};

exports.post_test = (req,res,next) => {
    const mid = req.body.movid;
    const title = req.body.title;
    const dor = req.body.date_of_release;
    const genre = req.body.genre;
    const actor = req.body.actor;
    const director = req.body.director;
    console.log(director);
    res.redirect('/addmovie');
};