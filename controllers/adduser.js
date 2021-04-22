const Movie = require('../models/user');
var neo4j = require('../models/neo4j');
exports.get_test = (req,res,next) => {
	res.render('adduser', {
        status: 0,
        pageTitle: 'Sign Up',
        path: '/adduser',
        editing: false,
        genre: ["Romantic","Comedy","Animation","Drama","Action","Thriller","Horror","Biography","Mythological"],
        actor: ["Shah Rukh Khan","Kareena Kapoor","Saif Ali Khan","Anushka Sharma","Hina Khan","Siddharth Malhotra","Alia Bhatt","Rajkumar Rao","Katrina Kaif"],
        fgenre: [],
        factor: []
    });
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
            genre: ["Romantic","Comedy","Animation","Drama","Action","Thriller","Horror","Biography","Mythological"],
            actor: ["Shah Rukh Khan","Kareena Kapoor","Saif Ali Khan","Anushka Sharma","Hina Khan","Siddharth Malhotra","Alia Bhatt","Rajkumar Rao","Katrina Kaif"],
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
                        genre: ["Romantic","Comedy","Animation","Drama","Action","Thriller","Horror","Biography","Mythological"],
                        actor: ["Shah Rukh Khan","Kareena Kapoor","Saif Ali Khan","Anushka Sharma","Hina Khan","Siddharth Malhotra","Alia Bhatt","Rajkumar Rao","Katrina Kaif"],
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
                    genre: ["Romantic","Comedy","Animation","Drama","Action","Thriller","Horror","Biography","Mythological"],
                    actor: ["Shah Rukh Khan","Kareena Kapoor","Saif Ali Khan","Anushka Sharma","Hina Khan","Siddharth Malhotra","Alia Bhatt","Rajkumar Rao","Katrina Kaif"],
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
                    result.records.forEach(record => {
                    console.log(record.get('name'))
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
                    genre: ["Romantic","Comedy","Animation","Drama","Action","Thriller","Horror","Biography","Mythological"],
                    actor: ["Shah Rukh Khan","Kareena Kapoor","Saif Ali Khan","Anushka Sharma","Hina Khan","Siddharth Malhotra","Alia Bhatt","Rajkumar Rao","Katrina Kaif"],
                    fgenre: genre,
                    factor: favactor,
                    editing: true
                    });
            }
        })
};