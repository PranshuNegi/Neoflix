const Movie = require('../models/user');
var neo4j = require('../models/neo4j');
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
    var session = neo4j.session;
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
        res.redirect('/login')
};