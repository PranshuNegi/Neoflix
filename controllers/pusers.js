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
    .run('MATCH (u1:user)<-[r:FOLLOW]-(u:user) return u1.name as name,count(u) as number order by number desc limit 50;',{})
    .then(result => {
        result.records.forEach(record => {
            it.push({
                name: record.get('name'),
                num: record.get('number')})
        });
        res.render('pusers', {
            pageTitle: 'Popular Users',
            path: '/pusers',
            itlist: it,
            clr: 0,
            status: 0
        });
    })
    .catch(error => {
        console.log(error)
    })
};