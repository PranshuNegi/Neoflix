const Movie = require('../models/user');
var neo4j = require('../models/neo4j');
exports.get_test = (req,res,next) => {
    if(!mlog) {
        res.redirect('/mlogin');
        return;
    }   
    res.render('addtag', {
        pageTitle: 'Add or Delete Tag',
        path: '/addtag',
        editing: false,
        bt: null,
        status: 0
    });
};

exports.post_test = (req,res,next) => {
    const tid = req.body.id;
    const btype = req.body.b_type;
    if(btype == "add"){
    const name = req.body.name;
    var session = neo4j.session;
    session
        .run('MATCH (t:tag {tagId: $taid}) RETURN t.tagId as td;',{
            taid: tid
        })
        .then(result => {
            if(result.records.length == 0){
                    var session = neo4j.session;
                    session
                        .run('CREATE (n:tag {name: $new, tagId: $taid})', {
                            new: name, taid: tid
                            })
                            .then(result => {
                            })
                            .catch(error => {
                                console.log(error)
                            })
                            res.render('addtag', {
                                pageTitle: 'Add or Delete Tag',
                                path: '/addtag',
                                tn: name,
                                editing: false,
                                bt: "add",
                                status: 1
                     });
                     return
                }
            else{
                res.render('addtag', {
                    pageTitle: 'Add or Delete Tag',
                    path: '/addtag',
                    status: 404,
                    editing: true,
                    bt: "add",
                    tn: name
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
        .run('MATCH (t:tag {tagId: $taid}) RETURN t.tagId as td;',{
            taid: tid
        })
        .then(result => {
            if(result.records.length == 0){
                    res.render('addtag', {
                        pageTitle: 'Add or Delete Tag',
                        path: '/addtag',
                        editing: false,
                        tid: tid,
                        bt: "del",
                        status: 404
                    });
                    return;
                }
                else{
                    var session = neo4j.session;
                    session
                    .run('MATCH (t:tag {tagId: $taid}) DETACH DELETE t',{
                        taid: tid
                    })
                    .then(result => {
                        res.render('addtag', {
                            pageTitle: 'Add or Delete Tag',
                            path: '/addtag',
                            editing: false,
                            tid: tid,
                            bt: "del",
                            status: 1
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
};