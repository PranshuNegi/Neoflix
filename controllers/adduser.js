const Movie = require('../models/user');

exports.get_test = (req,res,next) => {
	res.render('adduser', {
        pageTitle: 'Sign Up',
        path: '/adduser',
        editing: false,
        genre: ["Romantic","Comedy","Animation","Drama","Action","Thriller","Horror","Biography","Mythological"],
        actor: ["Shah Rukh Khan","Kareena Kapoor","Saif Ali Khan","Anushka Sharma","Hina Khan","Siddharth Malhotra","Alia Bhatt","Rajkumar Rao","Katrina Kaif"]
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
    if(pswd != cpswd){
        res.redirect('/adduser');
        console.log("Error");
    }
    var neo4j = require('neo4j-driver')
    var driver = neo4j.driver(
        'neo4j://localhost',
        neo4j.auth.basic('neo4j', 'dbislab')
    )
    var session = driver.session({
        database: 'neo4j',
        defaultAccessMode: neo4j.session.WRITE
    })
    session
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
        .then(() => session.close())
        res.redirect('/login')
};