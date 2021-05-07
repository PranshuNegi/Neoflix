const Movie = require('../models/user');
var neo4j = require('../models/neo4j');
var genre_list = [];
var actor_list = [];
exports.get_test = (req,res,next) => {    
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
            res.render('adduser', {
                status: 0,
                pageTitle: 'Sign Up',
                path: '/adduser',
                editing: false,
                genre: genre_list,
                actor: actor_list,
                fgenre: [],
                factor: [],
                error_message:""
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
    var name = req.body.name;
    var dob = req.body.date_of_birth;
    var diff = 2021 - Number(dob.slice(0, 4));
    var age = diff.toString();
    var gender = req.body.gender;
    var genre = req.body.genre;
    var favactor = req.body.favactor;
    const uname = req.body.username;
    const pswd = req.body.password;
    const cpswd = req.body.cpassword;
    if(genre == undefined){
        genre = [];
    }
    else if(typeof(genre)=="string"){
        genre = [genre];
    }
    if(favactor == undefined){
        favactor = [];
    }
    else if(typeof(favactor)=="string"){
        favactor = [favactor];
    }
    if(uname.length > 256 || uname == ""){
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
            editing: true,
            error_message: 'Length of username should be less than 256 and should not be an empty string'
            });
            return
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
                        editing: true,
                        error_message:'Password field and Confirm password field are not same'
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
                    editing: true,
                    error_message:'Password should be of the specified form'
                    });
            }
            else{
                // console.log(name);
                // console.log(dob);
                // console.log(gender);
                if(name=="") name=null;
                if(dob=="") {age=null;dob=null;}
                if(gender==undefined) gender=null;
                var session2 = neo4j.session;
                session2
                .run('CREATE (:user {username: $username,name: $name,dob: $dob,age: $age,gender: $gender, password: $password});', {
                    username: uname, name: name, dob: dob, age: age, gender: gender, password: pswd 
                    })
                    .then(result => {
                    var session3 = neo4j.session;
                    session3
                    .run('MATCH (u:user {username: $username}) MATCH (a:actor) WHERE a.name in $anamelist MERGE (u)-[:FAV_ACTOR]->(a)',{
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
                    editing: true,
                    error_message: 'Username is already in use, choose different username'
                    });
            }
        })
};