const Movie = require('../models/user');
var neo4j = require('../models/neo4j');
exports.get_test = (req,res,next) => {
    if(!alog){
        res.redirect('/alogin');
        return;
    }
    var it=[];
    var session = neo4j.session;
    session
    .run('MATCH (m:movie)<-[r:WATCHED]-(u:user) return m.title as name, m.released as r,count(u) as number order by number desc limit 50;',{})
    .then(result => {
        result.records.forEach(record => {
            it.push({
                name: record.get('name'),
                dr: record.get('r'),
                num: record.get('number')})
        });
        res.render('pmovie', {
            pageTitle: 'Popular Movies',
            path: '/pmovie',
            itlist: it,
            status: 0
        });
    })
    .catch(error => {
        console.log(error)
    })
};

exports.post_test = (req,res,next) => {
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
};