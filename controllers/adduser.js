const Movie = require('../models/user');
var neo4j = require('../models/neo4j');
var genre_list = [];
var actor_list = [];
exports.get_test = (req,res,next) => {    
    var session = neo4j.session;
    session
    .run('MATCH (g:genre) where g.name <> "(no genres listed)" return g.name AS name;',{
    
    })
    .then(result => {
        result.records.forEach(record => {
                genre_list.push(record.get('name'));
        
        })
        session
        .run('MATCH (a:person :actor) RETURN a.name AS name LIMIT 10;',{
        
        })
        .then(result2 => {
            result2.records.forEach(record2 => {
                actor_list.push(record2.get('name'));
            })
            res.render('adduser', {
                status: 0,
                pageTitle: 'Sign Up',
                path: '/adduser',
                editing: false,
                genre: genre_list,
                actor: actor_list,
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
	
};

exports.post_test = (req,res,next) => {
    const name = req.body.name;
    const dob = req.body.date_of_birth;
    const age = req.body.age;
    const gender = req.body.gender;
    const genre = req.body.genre;
    const favactor = req.body.favactor;
    const uname = req.body.username;
    const pswd = req.body.password;
    const cpswd = req.body.cpassword;
    if(uname.length > 256){
        res.render('adduser', {
            status: 0,
            pageTitle: 'Sign Up',
            path: '/adduser',
            user: {
                name: name,
                age: age,
                date_of_birth: dob,
                gender: gender,
                username: ""},
            genre: genre_list,
            actor: actor_list,
            fgenre: genre,
            factor: favactor,
            editing: true
            });
    }
    let re = new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})");
    var session = neo4j.session;
    session
        .run('MATCH (u:user {username: $username}) RETURN u.username as un;',{
        username: uname
        })
        .then(result => {
            if(result.records.length == 0){
                if(pswd != cpswd){
                    res.render('adduser', {
                        status: 404,
                        pageTitle: 'Sign Up',
                        path: '/adduser',
                        user: {
                            name: name,
                            age: age,
                            date_of_birth: dob,
                            gender: gender,
                            username: uname},
                        genre: genre_list,
                        actor: actor_list,
                        fgenre: genre,
                        factor: favactor,
                        editing: true
                        });
                }
            else if(!re.test(pswd)){
                res.render('adduser', {
                    status: 403,
                    pageTitle: 'Sign Up',
                    path: '/adduser',
                    user: {
                        name: name,
                        age: age,
                        date_of_birth: dob,
                        gender: gender,
                        username: uname},
                    genre: genre_list,
                    actor: actor_list,
                    fgenre: genre,
                    factor: favactor,
                    editing: true
                    });
            }
            else{
                var session2 = neo4j.session;
                session2
                .run('CREATE (:user {username: $username,name: $name,dob: $dob,age: $age,gender: $gender, password: $password});', {
                    username: uname, name: name, dob: dob, age: age, gender: gender, password: pswd 
                    })
                    .then(result => {
                    var session3 = neo4j.session;
                    session3
                    .run('MATCH (u:user {username: $username}) MATCH (a:actor) WHERE a.name = $anamelist MERGE (u)-[:FAV_ACTOR]->(a)',{
                        username: uname, anamelist: favactor
                    })
                    .then(result => {
                        var session4 = neo4j.session;
                        session4
                        .run('MATCH (u:user {username: $username}) MATCH (g:genre) WHERE g.name in $gnamelist MERGE (u)-[:FAV_GENRE]->(g)',{
                            username: uname, gnamelist: genre
                        })
                        .then(result =>{})
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
                    res.redirect('/login')
                }
            }
            else{
                res.render('adduser', {
                    status: 401,
                    pageTitle: 'Sign Up',
                    path: '/adduser',
                    user: {
        	            name: name,
        	            age: age,
        	            date_of_birth: dob,
        	            gender: gender,
        	            username: ""},
                    genre: genre_list,
                    actor: actor_list,
                    fgenre: genre,
                    factor: favactor,
                    editing: true
                    });
            }
        })
};