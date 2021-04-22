const Movie = require('../models/movie');
var neo4j = require('../models/neo4j');
exports.get_test = (req,res,next) => {
    var session = neo4j.session;
    var it = [];
    session
    .run('MATCH (m:movie)-[:OF_GENRE]->(g:genre) return m.title as title, "Ritika" as poster, m.released as drelease, m.imdbRating as rating, m.duration as dur, COLLECT(g.name) as gen , 0 as wn LIMIT 25;',{
        username: user
    })
    .then(result => {
        result.records.forEach(record => {
            it.push({
                title: record.get('title'),
                image: record.get('poster'),
                date_of_release: record.get('drelease'),
                rating: record.get('rating'),
                watched: record.get('wn'),
                duration: record.get('dur'),
                genre: record.get('gen')})
        });
        console.log(it);
        res.render('movies', {
            pageTitle: 'All Movies',
            path: '/movies',
            itlist: it
        });
    })
    .catch(error => {
        console.log(error)
    })
};
