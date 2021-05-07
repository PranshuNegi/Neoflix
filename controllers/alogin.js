const Movie = require('../models/user');
var neo4j = require('../models/neo4j');
exports.get_test = (req,res,next) => {
    user = null;
    alog = false;
    mlog = false;
	res.render('alogin', {
        pageTitle: 'Analyst',
        path: '/alogin',
        status: 0
    });
};

exports.post_test = (req,res,next) => {
    const btype = req.body.b_type;
    if(btype == "lg"){
    const paswd = req.body.password;
    if(paswd == pd){
        alog = true;
        res.redirect('/pmovie');
    }
    else{
        res.render('alogin', {
            pageTitle: 'Analyst',
            path: '/alogin',
            status: 404
        });
    }
}
else if(btype == "mlg"){
    res.redirect('/mlogin');
}
else{
    res.redirect('/login');
}
};