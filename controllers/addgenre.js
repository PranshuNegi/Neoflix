const Movie = require('../models/user');
var neo4j = require('../models/neo4j');
exports.get_test = (req,res,next) => {
    if(!mlog) {
        res.redirect('/mlogin');
        return;
    }   
    res.render('addgenre', {
        pageTitle: 'Add Genre',
        path: '/addgenre',
        status: 0
    });
};

exports.post_test = (req,res,next) => {
    const genre = req.body.genre;
    var session = neo4j.session;
    session
        .run('MATCH (g:genre {name: $gname}) RETURN g.name as gn;',{
        gname: genre
        })
        .then(result => {
            if(result.records.length == 0){
                var session2 = neo4j.session;
                session2
                .run('CREATE (n:genre {name :$new})', {
                    new: genre
                    })
                    .then(result => {
                    })
                    .catch(error => {
                        console.log(error)
                    })
                    res.render('addgenre', {
                        pageTitle: 'Add Genre',
                        path: '/addgenre',
                        gn: genre,
                        status: 1
                    });
                }
            else{
                res.render('addgenre', {
                    pageTitle: 'Add Genre',
                    path: '/addgenre',
                    status: 404
                });
            }
        })
};