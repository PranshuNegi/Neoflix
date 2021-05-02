const Movie = require('../models/movie');
var neo4j = require('../models/neo4j');
exports.get_test = (req,res,next) => {
    if(user == null){
        res.redirect('/login');
        return
    }
    var session = neo4j.session;
    var it = [];
    var it1 = [];
    session
    .run('MATCH (a:actor)<-[:FAV_ACTOR]-(u:user)-[:FAV_GENRE]->(g:genre) MATCH  (u1: user {username: $username})-[:FOLLOW]->(u2:user) where u2.username = u.username and g.name <> "(no genres listed)" return u.username as uname, u.name as name, u.age as age, u.gender as gender, apoc.coll.toSet(COLLECT(g.name)) as fgen, apoc.coll.toSet(COLLECT(a.name)) as act;',{
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
                actor: record.get('act')})
        });
        session
        .run('MATCH (a:actor)<-[:FAV_ACTOR]-(u:user)-[:FAV_GENRE]->(g:genre) MATCH  (u1: user {username: $username}) where NOT (u1)-[:FOLLOW]->(u) and u1.username <> u.username and g.name <> "(no genres listed)" return u.username as uname, u.name as name, u.age as age, u.gender as gender, apoc.coll.toSet(COLLECT(g.name)) as fgen, apoc.coll.toSet(COLLECT(a.name)) as act LIMIT 50;',{
            username: user
        })
        .then(result1 => {
            result1.records.forEach(record1 => {
                it1.push({
                uname: record1.get('uname'),
                name: record1.get('name'),
                age: record1.get('age'),
                gender: record1.get('gender'),
                genre: record1.get('fgen'),
                actor: record1.get('act')})
            });
        res.render('users', {
            pageTitle: 'Follow other Users',
            path: '/users',
            itlist: it,
            itlist1: it1
            });
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
    else if(btype == "sch"){
        const to_search = req.body.search;
        var session = neo4j.session;
        var it = [];
        session
        .run('MATCH (a:actor)<-[:FAV_ACTOR]-(u:user)-[:FAV_GENRE]->(g:genre) MATCH  (u1: user {username: $username}) where toLower(u.name) contains toLower($search_key) and u1.username <> u.username and g.name <> "(no genres listed)" return u.username as uname, u.name as name, u.age as age, u.gender as gender, apoc.coll.toSet(COLLECT(g.name)) as fgen, apoc.coll.toSet(COLLECT(a.name)) as act, (case exists((u1)-[:FOLLOW]->(u)) when true then 1 else 0 end) as fn LIMIT 50;',{
            username: user, search_key: to_search
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
