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
        res.render('pmovie', {
            pageTitle: 'Popular Movies',
            path: '/pmovie',
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
    .run('MATCH (m:movie)<-[:WATCHED]-(u:user) where toInteger(u.age)<=$ul and toInteger(u.age)>=$lol return m.title as name,m.released as r, count(m) as number order by number desc limit 10;',{
        ul: hh, lol:ll
    })
    .then(result => {
        result.records.forEach(record => {
            it1.push({
                name: record.get('name'),
                dr: record.get('r'),
                num: record.get('number')})
        });
        res.render('pmovie', {
            pageTitle: 'Popular Movies',
            path: '/pmovie',
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
    res.redirect('/pmovie');
    return;
}
};