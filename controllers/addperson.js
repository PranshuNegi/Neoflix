const Movie = require('../models/user');
var neo4j = require('../models/neo4j');
exports.get_test = (req,res,next) => {
    if(!mlog) {
        res.redirect('/mlogin');
        return;
    }   
    res.render('addperson', {
        pageTitle: 'Add Person',
        path: '/addperson',
        editing: false,
        status: 0
    });
};

exports.post_test = (req,res,next) => {
    const pid = req.body.id;
    const name = req.body.name;
    const role = req.body.role;
    console.log(role);
    var session = neo4j.session;
    session
        .run('MATCH (p:person {personId: $peid}) RETURN p.personId as pd;',{
            peid: pid
        })
        .then(result => {
            if(result.records.length == 0){
                if(role == null){
                    res.render('addperson', {
                        pageTitle: 'Add Person',
                        path: '/addperson',
                        editing: true,
                        pn: name,
                        pid: pid,
                        status: 404
                    });
                    return;
                }
                else if(role == "Actor"){
                    var session = neo4j.session;
                    session
                        .run('CREATE (n:person:actor {name: $new, personId: $ppid})', {
                            new: name, ppid: pid
                            })
                            .then(result => {
                            })
                            .catch(error => {
                                console.log(error)
                            })
                            res.render('addperson', {
                                pageTitle: 'Add Person',
                                path: '/addperson',
                                pn: name,
                                editing: false,
                                status: 1
                     });
                     return;
                }
                else if(role == "Director"){
                    var session = neo4j.session;
                    session
                        .run('CREATE (n:person:director {name: $new, personId: $ppid})', {
                            new: name, ppid: pid
                            })
                            .then(result => {
                            })
                            .catch(error => {
                                console.log(error)
                            })
                            res.render('addperson', {
                                pageTitle: 'Add Person',
                                path: '/addperson',
                                pn: name,
                                editing: false,
                                status: 1
                     });
                     return;
                }
                else{
                    var session = neo4j.session;
                    session
                        .run('CREATE (n:person:actor:director {name: $new, personId: $ppid})', {
                            new: name, ppid: pid
                            })
                            .then(result => {
                            })
                            .catch(error => {
                                console.log(error)
                            })
                            res.render('addperson', {
                                pageTitle: 'Add Person',
                                path: '/addperson',
                                pn: name,
                                editing: false,
                                status: 1
                     });
                     return
                }
            }
            else{
                res.render('addperson', {
                    pageTitle: 'Add Person',
                    path: '/addperson',
                    status: 403,
                    editing: true,
                    pn: name
                });
            }
        })
        .catch(error => {
            console.log(error)
        })
};