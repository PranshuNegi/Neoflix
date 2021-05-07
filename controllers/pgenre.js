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
    .run('MATCH (g:genre)<-[r:FAV_GENRE]-(u:user) return g.name as name,count(u) as number order by number desc;',{})
    .then(result => {
        result.records.forEach(record => {
            it.push({
                name: record.get('name'),
                num: record.get('number')})
        });
        res.render('pgenre', {
            pageTitle: 'Popular Genre',
            path: '/pgenre',
            itlist: it,
            clr: 0,
            status: 0
        });
    })
    .catch(error => {
        console.log(error)
    })
};