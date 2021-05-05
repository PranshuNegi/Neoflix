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
    var it2=[];
    var it3=[];
    session
    .run('MATCH (a:actor)<-[:FAV_ACTOR]-(u:user)-[:FAV_GENRE]->(g:genre) MATCH  (u1: user {username: $username})-[:FOLLOW]->(u2:user) where u2.username = u.username and g.name <> "(no genres listed)" return u.username as uname, u.name as name, u.age as age, u.gender as gender, COLLECT(distinct g.name) as fgen, COLLECT(distinct a.name) as act;',{
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
        .run('MATCH (u1:user {username : $username})-[r:WATCHED]->(m:movie) WITH u1, avg(r.rating) AS u1_mean MATCH (u1)-[r1:WATCHED]->(m:movie)<-[r2:WATCHED]-(u2) WITH u1, u1_mean, u2, COLLECT({r1: r1, r2: r2}) AS ratings WHERE size(ratings) > 10 MATCH (u2)-[r:WATCHED]->(m:movie) WITH u1, u1_mean, u2, avg(r.rating) AS u2_mean, ratings UNWIND ratings AS r WITH sum( (r.r1.rating-u1_mean) * (r.r2.rating-u2_mean) ) AS nom, sqrt( sum( (r.r1.rating - u1_mean)^2) * sum( (r.r2.rating - u2_mean) ^2)) AS denom, u1, u2 WHERE denom <> 0 with u1,u2, nom/denom AS pearson ORDER BY pearson DESC LIMIT 50  MATCH (a:actor)<-[:FAV_ACTOR]-(u2)-[:FAV_GENRE]->(g:genre)  where NOT ((u1)-[:FOLLOW]->(u2)) and u1.username <> u2.username and g.name <> "(no genres listed)" return u2.username as uname, u2.name as name, u2.age as age, u2.gender as gender, COLLECT(DISTINCT g.name) as fgen, COLLECT(DISTINCT a.name) as act;',{
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
            session.run('MATCH p=(u1:user {username:$username})-[:FOLLOW*2..5]->(u2:user) where not((u1)-[:FOLLOW]->(u2)) with u1,u2 order by length(p) limit 40 MATCH (a:actor)<-[:FAV_ACTOR]-(u2)-[:FAV_GENRE]->(g:genre)  where NOT ((u1)-[:FOLLOW]->(u2)) and u1.username <> u2.username and g.name <> "(no genres listed)" return u2.username as uname, u2.name as name, u2.age as age, u2.gender as gender, COLLECT(DISTINCT g.name) as fgen, COLLECT(DISTINCT a.name) as act;',{username : user}).then(result2=>{
                    result2.records.forEach(record1 => {
                        it2.push({
                        uname: record1.get('uname'),
                        name: record1.get('name'),
                        age: record1.get('age'),
                        gender: record1.get('gender'),
                        genre: record1.get('fgen'),
                        actor: record1.get('act')})
                    });
                    session.run('MATCH (a:actor)<-[:FAV_ACTOR]-(u:user)-[:FAV_GENRE]->(g:genre) MATCH  (u1: user {username: $username})<-[:FOLLOW]-(u2:user) where u2.username = u.username and g.name <> "(no genres listed)" return u.username as uname, u.name as name, u.age as age, u.gender as gender, COLLECT(DISTINCT g.name) as fgen, COLLECT(DISTINCT a.name) as act,(case exists((u1)-[:FOLLOW]->(u2)) when true then 1 else 0 end)  as follows;',{username:user}).then(result3=>{
                            result3.records.forEach(record1 => {
                                it3.push({
                                uname: record1.get('uname'),
                                name: record1.get('name'),
                                age: record1.get('age'),
                                gender: record1.get('gender'),
                                genre: record1.get('fgen'),
                                actor: record1.get('act'),
                                follows: record1.get('follows')});

                            });
                            res.render('users', {
                                pageTitle: 'Follow other Users',
                                path: '/users',
                                itlist: it,
                                itlist1: it1,
                                itlist2: it2,
                                itlist3: it3
                            });
                    });
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
        var it1 = [];
        session
        .run('MATCH (a:actor)<-[:FAV_ACTOR]-(u:user)-[:FAV_GENRE]->(g:genre) MATCH  (u1: user {username: $username})-[:FOLLOW]->(u2:user) where u2.username = u.username and toLower(u.name) contains toLower($search_key) and u1.username <> u.username and g.name <> "(no genres listed)" return u.username as uname, u.name as name, u.age as age, u.gender as gender, COLLECT(distinct g.name) as fgen, COLLECT(distinct a.name) as act LIMIT 50;',{
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
                    actor: record.get('act')})
            });
            session
        .run('MATCH (a:actor)<-[:FAV_ACTOR]-(u:user)-[:FAV_GENRE]->(g:genre) MATCH  (u1: user {username: $username}) where NOT (u1)-[:FOLLOW]->(u) and u1.username <> u.username and toLower(u.name) contains toLower($search_key) and g.name <> "(no genres listed)" return u.username as uname, u.name as name, u.age as age, u.gender as gender, COLLECT(distinct g.name) as fgen, COLLECT(distinct a.name) as act LIMIT 50;',{
            username: user, search_key: to_search
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
//MATCH (u1:user {username : $username})-[r:WATCHED]->(m:movie) WITH u1, avg(r.rating) AS u1_mean MATCH (u1)-[r1:WATCHED]->(m:movie)<-[r2:WATCHED]-(u2) WITH u1, u1_mean, u2, COLLECT({r1: r1, r2: r2}) AS ratings WHERE size(ratings) > 10 MATCH (u2)-[r:WATCHED]->(m:movie) WITH u1, u1_mean, u2, avg(r.rating) AS u2_mean, ratings UNWIND ratings AS r WITH sum( (r.r1.rating-u1_mean) * (r.r2.rating-u2_mean) ) AS nom, sqrt( sum( (r.r1.rating - u1_mean)^2) * sum( (r.r2.rating - u2_mean) ^2)) AS denom, u1, u2 WHERE denom <> 0 with u1,u2, nom/denom AS pearson ORDER BY pearson DESC LIMIT 50  MATCH (a:actor)<-[:FAV_ACTOR]-(u2)-[:FAV_GENRE]->(g:genre)  where NOT ((u1)-[:FOLLOW]->(u2)) and u1.username <> u2.username and g.name <> "(no genres listed)" return u2.username as uname, u2.name as name, u2.age as age, u2.gender as gender, COLLECT(DISTINCT g.name) as fgen, COLLECT(DISTINCT a.name) as act;

//MATCH p=(u1:user {username:$username})-[:FOLLOW*2..5]->(u2:user) where not((u1)-[:FOLLOW]->(u2)) with u1,u2 order by length(p) limit 40 MATCH (a:actor)<-[:FAV_ACTOR]-(u2)-[:FAV_GENRE]->(g:genre)  where NOT ((u1)-[:FOLLOW]->(u2)) and u1.username <> u2.username and g.name <> "(no genres listed)" return u2.username as uname, u2.name as name, u2.age as age, u2.gender as gender, COLLECT(DISTINCT g.name) as fgen, COLLECT(DISTINCT a.name) as act;