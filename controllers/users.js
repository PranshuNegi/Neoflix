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
    .run('MATCH (a:actor)<-[:FAV_ACTOR]-(u:user)-[:FAV_GENRE]->(g:genre) MATCH  (u1: user {username: $username}) where u1.username <> u.username and g.name <> "(no genres listed)" return u.username as uname, u.name as name, u.age as age, u.gender as gender, apoc.coll.toSet(COLLECT(g.name)) as fgen, apoc.coll.toSet(COLLECT(a.name)) as act, (case exists((u1)-[:FOLLOW]->(u)) when true then 1 else 0 end) as fn LIMIT 50;',{
        username: user
    })
    .then(result => {
        result.records.forEach(record => {
            it.push({
                uname: record.get('uname'),
                name: record.get('name'),
                age: record.get('age'),
                gender: record.get('gender'),
                genre: record.get('fgen'),
                actor: record.get('act'),
                fornot: record.get('fn')})
        });
        res.render('users', {
            pageTitle: 'Follow other Users',
            path: '/users',
            itlist: it
        });
    })
    .catch(error => {
        console.log(error)
    })
};

exports.post_test = (req,res,next) => {
    const btype = req.body.b_type;
    const us = req.body.us;
    if(btype == "fl"){
        var session = neo4j.session;
        session
        .run('MATCH (u1:user {username: $username}) MATCH (u: user {username:$use}) MERGE (u1)-[:FOLLOW]->(u);',{
            username: user, use: us
        })
        .then(result => {
            res.redirect('/users');
        })
        .catch(error => {
            console.log(error)
        })
        
    }
    else{
        var session = neo4j.session;
        session
        .run('MATCH (u1:user {username: $username})-[r:FOLLOW]->(u: user {username:$use}) DELETE r;',{
            username: user, use: us
        })
        .then(result => {
            res.redirect('/users');
        })
        .catch(error => {
            console.log(error)
        })
    }
};
