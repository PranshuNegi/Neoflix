const Movie = require('../models/user');
var neo4j = require('../models/neo4j');
var genre_list = [];
var actor_list = [];

exports.get_test = (req,res,next) => {
    if(user == null){
        res.redirect('/login');
        return
    }
    genre_list = [];
    actor_list = [];
    var favgenre = [];
    var favactor = [];
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
            .run('MATCH (u:user {username: $username})-[:FAV_GENRE]->(g:genre) return g.name as name;',{
                username: user
            })
            .then(result3 => {
                result3.records.forEach(record3 => {
                    favgenre.push(record3.get('name'));
                })
                session
                .run('MATCH (u:user {username: $username})-[:FAV_ACTOR]->(a:actor) return a.name as name;',{
                    username: user
                })
                .then(result4 => {
                    result4.records.forEach(record4 => {
                        favactor.push(record4.get('name'));
                    })
                    session
                    .run('MATCH (u:user {username: $username}) return u.name as n,u.age as a, u.dob as dob, u.gender as g;',{
                        username: user
                    })
                    .then(result5 => {
                    res.render('editprofile', {
                        status: 0,
                        pageTitle: 'Edit Profile',
                        path: '/editprofile',
                        user: {
                            name: result5.records[0].get('n'),
                            age: result5.records[0].get('a'),
                            date_of_birth: result5.records[0].get('dob'),
                            gender: result5.records[0].get('g')},
                        editing: true,
                        genre: genre_list,
                        actor: actor_list,
                        fgenre: favgenre,
                        factor: favactor
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
    })
    .catch(error => {
        console.log(error)
    }) 
};


exports.post_test = (req,res,next) => {
    const name = req.body.name;
    const dob = req.body.date_of_birth;
    const diff = 2021 - Number(dob.slice(0, 4));
    const age = diff.toString();
    const gender = req.body.gender;
    const genre = req.body.genre;
    const favactor = req.body.favactor;
    if(typeof(genre)=="string" && typeof(favactor)=="string"){
        res.render('editprofile', {
            status: 0,
            pageTitle: 'Edit Profile',
            path: '/editprofile',
            editing: true,
            user: {
                name: name,
                age: age,
                date_of_birth: dob,
                gender: gender,
                username: ""},
            genre: genre_list,
            actor: actor_list,
            fgenre: [],
            factor: []
        });
        return
    }
    if(typeof(genre)=="string"){
        res.render('editprofile', {
            status: 0,
            pageTitle: 'Edit Profile',
            path: '/editprofile',
            editing: true,
            user: {
                name: name,
                age: age,
                date_of_birth: dob,
                gender: gender,
                username: ""},
            genre: genre_list,
            actor: actor_list,
            fgenre: [],
            factor: favactor
        });
        return
    }
    if(typeof(favactor)=="string"){
        res.render('editprofile', {
            status: 0,
            pageTitle: 'Edit Profile',
            path: '/editprofile',
            editing: true,
            user: {
                name: name,
                age: age,
                date_of_birth: dob,
                gender: gender,
                username: ""},
            genre: genre_list,
            actor: actor_list,
            fgenre: genre,
            factor: []
        });
        return
    }
    var session = neo4j.session;
    session
        .run('MATCH (u:user {username: $username})-[r:FAV_ACTOR]->(a:actor) DELETE r;',{
        username: user
        })
        .then(result => {
            session
            .run('MATCH (u:user {username: $username}) MATCH (a:actor) WHERE a.name in $anamelist MERGE (u)-[:FAV_ACTOR]->(a)',{
                username: user, anamelist: favactor
            })
            .then(result1 => {
                session
                .run('MATCH (u:user {username: $username})-[r:FAV_GENRE]->(g:genre) DELETE r;',{
                    username: user
                })
                .then(result2 => {
                    session
                    .run('MATCH (u:user {username: $username}) MATCH (g:genre) WHERE g.name in $gnamelist MERGE (u)-[:FAV_GENRE]->(g)',{
                        username: user, gnamelist: genre
                    })
                    .then(result3 => {
                        session
                        .run('MATCH (u:user {username: $username}) SET u.name = $n, u.age = $a, u.dob = $d, u.gender = $g;',{
                            username: user,n:name, a: age, d: dob, g: gender
                        })
                        .then( result4 => {
                            res.redirect('/movies');
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
};