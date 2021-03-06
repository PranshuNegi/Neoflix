const Movie = require('../models/user');
var neo4j = require('../models/neo4j');
exports.get_test = (req,res,next) => {
    if(!mlog) {
        res.redirect('/mlogin');
        return;
    }   
    res.render('addgenre', {
        pageTitle: 'Add or Delete Genre',
        path: '/addgenre',
        bt: null,
        status: 0
    });
};

exports.post_test = (req,res,next) => {
    const genre = req.body.genre;
    const btype = req.body.b_type;
    if(btype == "add"){
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
                        pageTitle: 'Add or Delete Genre',
                        path: '/addgenre',
                        gn: genre,
                        bt: "add",
                        status: 1
                    });
                }
            else{
                res.render('addgenre', {
                    pageTitle: 'Add or Delete Genre',
                    path: '/addgenre',
                    bt: "add",
                    status: 404
                });
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
    else{
        var session = neo4j.session;
        session
            .run('MATCH (g:genre {name: $gname}) RETURN g.name as gn;',{
            gname: genre
            })
            .then(result => {
                if(result.records.length == 0){
                    res.render('addgenre', {
                        pageTitle: 'Add or Delete Genre',
                        path: '/addgenre',
                        bt: "del",
                        gn: genre,
                        status: 404
                    });
                }
                else{
                    var session2 = neo4j.session;
                    session2
                    .run('MATCH (n:genre {name :$ne}) DETACH DELETE n', {
                        ne: genre
                        })
                        .then(result => {
                        })
                        .catch(error => {
                            console.log(error)
                        })
                        res.render('addgenre', {
                            pageTitle: 'Add or Delete Genre',
                            path: '/addgenre',
                            gn: genre,
                            bt: "del",
                            status: 1
                        });
                }
            })
            .catch(error => {
                console.log(error)
            })
        }
};