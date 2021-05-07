const Movie = require('../models/user');
var neo4j = require('../models/neo4j');
var it = [];
exports.get_test = (req,res,next) => {
    if(!alog){
        res.redirect('/alogin');
        return;
    }
    it=[];
    var session = neo4j.session;
    session
    .run('MATCH (u:user)-[r:FAV_ACTOR]->(a:actor) return a.name as name,count(u) as number order by number desc limit 50;',{})
    .then(result => {
        result.records.forEach(record => {
            it.push({
                name: record.get('name'),
                num: record.get('number')})
        });
        res.render('pactor', {
            pageTitle: 'Popular Actors',
            path: '/pactor',
            itlist: it,
            clr: 0,
            status: 0
        });
    })
    .catch(error => {
        console.log(error)
    })
};

exports.post_test = (req,res,next) => {
    const btype = req.body.b_type;
    if(btype == "sch"){
    const ll = Number(req.body.lowlimit);
    const hh = Number(req.body.highlimit);
    if(ll >  hh){
        res.render('pactor', {
            pageTitle: 'Popular Actors',
            path: '/pactor',
            itlist: it,
            clr: 0,
            status: 404
        });
        return;
    }
    else{
    var it1=[];
    var session = neo4j.session;
    session
    .run('MATCH (u:user)-[r:FAV_ACTOR]->(a:actor) where toInteger(u.age)<=$ul and toInteger(u.age)>=$lol return a.name as name,count(u) as number order by number desc limit 50',{
        ul: hh, lol:ll
    })
    .then(result => {
        result.records.forEach(record => {
            it1.push({
                name: record.get('name'),
                num: record.get('number')})
        });
        res.render('pactor', {
            pageTitle: 'Popular Actors',
            path: '/pactor',
            itlist: it1,
            clr: 1,
            status: 0
        });
    })
    .catch(error => {
        console.log(error)
    })
    return;
    }
}
else{
    res.redirect('/pactor');
    return;
}
};