const Movie = require('../models/movie');
var neo4j = require('../models/neo4j');
exports.get_test = (req,res,next) => {
 if(user == null){
        res.redirect('/login');
        return
    }
    var session = neo4j.session;
    var favActor = [];
    session
    .run('MATCH (u:user {username : $username})-[:FAV_ACTOR]->(a:actor) MATCH (a:actor)-[:ACTED_IN]->(m:movie) WHERE NOT EXISTS ( (u)-[:WATCHED]->(m) ) and exists (m.imdbRating) MATCH (m:movie)-[r:OF_GENRE]->(g:genre) RETURN m.movieId as id ,m.title as title, COLLECT(g.name) as gen, m.poster as poster, m.released as drelease, m.imdbRating as rating, m.duration as dur,(case exists((u)-[:WATCHED]->(m)) when true then 1 else 0 end) as wn order by m.imdbRating desc LIMIT 5;',{
        username: user
    })
    .then(result => {
        console.log(result);
        result.records.forEach(record => {
            favActor.push({
                id: record.get('id'),
                title: record.get('title'),
                image: record.get('poster'),
                date_of_release: record.get('drelease'),
                rating: record.get('rating'),
                watched: record.get('wn'),
                duration: record.get('dur'),
                genre: record.get('gen')})
        });
        var session2=neo4j.session;
        var favGenre = [];
        session2.run('MATCH (u:user {username : $username})-[:FAV_GENRE]->(g:genre) MATCH (m:movie)-[:OF_GENRE]->(g:genre) WHERE NOT EXISTS ( (u)-[:WATCHED]->(m) ) and exists (m.imdbRating) MATCH (m:movie)-[r:OF_GENRE]->(g:genre) RETURN m.movieId as id ,m.title as title, COLLECT(g.name) as gen, m.poster as poster, m.released as drelease, m.imdbRating as rating, m.duration as dur,(case exists((u)-[:WATCHED]->(m)) when true then 1 else 0 end) as wn order by m.imdbRating desc LIMIT 5;',{
            username: user
        })
        .then(result2 => {
            result2.records.forEach(record => {
                favGenre.push({
                    id: record.get('id'),
                    title: record.get('title'),
                    image: record.get('poster'),
                    date_of_release: record.get('drelease'),
                    rating: record.get('rating'),
                    watched: record.get('wn'),
                    duration: record.get('dur'),
                    genre: record.get('gen')});
            });
            var session3=neo4j.session;
            var favGenreViewing=[]
            session3.run('MATCH ( u : user { username : $username })-[ r : WATCHED ]->( m : movie ) WITH u , avg ( r . rating ) AS mean MATCH ( u )-[ r : WATCHED ]->( m : movie )-[: OF_GENRE ]->( g : genre ) WHERE r . rating > mean WITH u , g , COUNT (*) AS score MATCH ( g )<-[: OF_GENRE ]-( m1 : movie ) WHERE NOT EXISTS (( u )-[: WATCHED ]->( m1 )) and exists(m1.imdbRating) RETURN m1.movieId as id ,m1.title as title, m1.poster as poster, m1.released as drelease, m1.imdbRating as rating, m1.duration as dur, COLLECT ( DISTINCT g.name ) as gen , SUM ( score ) AS score1, (case exists((u)-[:WATCHED]->(m1)) when true then 1 else 0 end)  as wn ORDER BY score1 DESC, m1.imdbRating DESC LIMIT 5;',{username:user}).then(result3=>{
                    result3.records.forEach(record => {
                    favGenreViewing.push({
                        id: record.get('id'),
                        title: record.get('title'),
                        image: record.get('poster'),
                        date_of_release: record.get('drelease'),
                        rating: record.get('rating'),
                        watched: record.get('wn'),
                        duration: record.get('dur'),
                        genre: record.get('gen')});
                    });
                    var session4=neo4j.session;
                    var viewingHistory=[];
                    session4.run('MATCH ( u : user { username : $username }) MATCH ( u )-[ r : WATCHED ]->( m : movie ) WITH u , avg ( r . rating ) AS average MATCH ( u )-[ r : WATCHED ]->( m : movie ) WHERE r . rating > average MATCH ( m : movie )-[ s : MOVIE_SIM_MOVIE ]->( m1 : movie ) WHERE NOT EXISTS ( ( u)-[: WATCHED ]->( m1) ) MATCH ( m1 : movie )-[ OF_GENRE ]->( g : genre ) RETURN m1.movieId as id ,m1.title as title, m1.poster as poster, m1.released as drelease, m1.imdbRating as rating, m1.duration as dur, COLLECT ( DISTINCT g.name) as gen, (case exists((u)-[:WATCHED]->(m1)) when true then 1 else 0 end)  as wn,s.relevance as x ORDER BY x desc LIMIT 5;',{username:user}).then(result4=>{
                            result4.records.forEach(record => {
                            viewingHistory.push({
                                id: record.get('id'),
                                title: record.get('title'),
                                image: record.get('poster'),
                                date_of_release: record.get('drelease'),
                                rating: record.get('rating'),
                                watched: record.get('wn'),
                                duration: record.get('dur'),
                                genre: record.get('gen')});
                            });
                            var session5=neo4j.session;
                            var collaborative=[];
                            session5.run('MATCH (u1:user {username : $username})-[r:WATCHED]->(m:movie) WITH u1, avg(r.rating) AS u1_mean MATCH (u1)-[r1:WATCHED]->(m:movie)<-[r2:WATCHED]-(u2) WITH u1, u1_mean, u2, COLLECT({r1: r1, r2: r2}) AS ratings WHERE size(ratings) > 10 MATCH (u2)-[r:WATCHED]->(m:movie) WITH u1, u1_mean, u2, avg(r.rating) AS u2_mean, ratings UNWIND ratings AS r WITH sum( (r.r1.rating-u1_mean) * (r.r2.rating-u2_mean) ) AS nom,sqrt( sum( (r.r1.rating - u1_mean)^2) * sum( (r.r2.rating - u2_mean) ^2)) AS denom,u1, u2 WHERE denom <> 0 WITH u1, u2, nom/denom AS pearson ORDER BY pearson DESC LIMIT 10 MATCH (u2)-[r:WATCHED]->(m:movie) WHERE NOT EXISTS( (u1)-[:WATCHED]->(m) ) with m,sum(pearson*r.rating) as score MATCH (m)-[:OF_GENRE]->(g:genre) RETURN m.movieId as id ,m.title as title, collect(DISTINCT g.name) as gen, m.poster as poster, m.released as drelease, m.imdbRating as rating, m.duration as dur,0 as wn,score order by score desc LIMIT 5;',{username:user}).then(result5=>{
                                    result5.records.forEach(record => {
                                    collaborative.push({
                                        id: record.get('id'),
                                        title: record.get('title'),
                                        image: record.get('poster'),
                                        date_of_release: record.get('drelease'),
                                        rating: record.get('rating'),
                                        watched: record.get('wn'),
                                        duration: record.get('dur'),
                                        genre: record.get('gen')});
                                    });
                                    var session6=neo4j.session;
                                    var followedUsers=[];
                                    session6.run('MATCH (u1:user {username:$username})-[:FOLLOW]->(u2) with u1,u2 MATCH (u2)-[r:WATCHED]->(m:movie) WHERE NOT EXISTS( (u1)-[:WATCHED]->(m) ) with m,sum(r.rating) as score MATCH (m)-[:OF_GENRE]->(g:genre) RETURN m.movieId as id ,m.title as title, collect(DISTINCT g.name) as gen, m.poster as poster, m.released as drelease, m.imdbRating as rating, m.duration as dur,0 as wn,score order by score desc LIMIT 5;',{username:user}).then(result6=>{
                                            result6.records.forEach(record => {
                                            followedUsers.push({
                                                id: record.get('id'),
                                                title: record.get('title'),
                                                image: record.get('poster'),
                                                date_of_release: record.get('drelease'),
                                                rating: record.get('rating'),
                                                watched: record.get('wn'),
                                                duration: record.get('dur'),
                                                genre: record.get('gen')});
                                            });
                                            res.render('recmovies', {
                                                    pageTitle: 'Recommended Movies',
                                                    path: '/recmovies',
                                                    itlist0: collaborative,
                                                    itlist1:  followedUsers,
                                                    itlist2: viewingHistory,
                                                    itlist3: favGenreViewing,
                                                    itlist4: favActor,
                                                    itlist5: favGenre
                                            });
                                    });
                            });
                    });
                });
        });
    })
    .catch(error => {
        console.log(error)
    });
};
// MATCH ( u : user { username : $username })-[ r : WATCHED ]->( m : movie ) WITH u , avg ( r . rating ) AS mean MATCH ( u )-[ r : WATCHED ]->( m : movie )-[: OF_GENRE ]->( g : genre ) WHERE r . rating >= mean WITH u , g , COUNT (*) AS score MATCH ( g )<-[: OF_GENRE ]-( m1 : movie ) WHERE NOT EXISTS (( u )-[: WATCHED ]->( m1 )) and exists(m1.imdbRating) RETURN m1.movieId as id ,m1.title as title, m1.poster as poster, m1.released as drelease, m1.imdbRating as rating, m1.duration as dur, COLLECT ( DISTINCT g.name ) as gen , SUM ( score ) AS score1, 0 as wn ORDER BY score1 DESC, m1.imdbRating DESC LIMIT 10

//MATCH ( u : user { username : $username }) MATCH ( u )-[ r : WATCHED ]->( m : movie ) WITH u , avg ( r . rating ) AS average MATCH ( u )-[ r : WATCHED ]->( m : movie ) WHERE r . rating > average MATCH ( m : movie )-[ s : MOVIE_SIM_MOVIE ]->( m1 : movie ) WHERE NOT EXISTS ( ( u)-[: WATCHED ]->( m1) ) and exists(m1.imdbRating) MATCH ( m1 : movie )-[ OF_GENRE ]->( g : genre ) RETURN m1.movieId as id ,m1.title as title, m1.poster as poster, m1.released as drelease, m1.imdbRating as rating, m1.duration as dur, COLLECT ( DISTINCT g.name) as gen, (case exists((u)-[:WATCHED]->(m1)) when true then 1 else 0 end)  as wn,s.relevance as x ORDER BY x desc, m1.imdbRating DESC LIMIT 5;

//MATCH (u1:user {username : $username})-[r:WATCHED]->(m:movie) WITH u1, avg(r.rating) AS u1_mean MATCH (u1)-[r1:WATCHED]->(m:movie)<-[r2:WATCHED]-(u2) WITH u1, u1_mean, u2, COLLECT({r1: r1, r2: r2}) AS ratings WHERE size(ratings) > 10 MATCH (u2)-[r:WATCHED]->(m:movie) WITH u1, u1_mean, u2, avg(r.rating) AS u2_mean, ratings UNWIND ratings AS r WITH sum( (r.r1.rating-u1_mean) * (r.r2.rating-u2_mean) ) AS nom,sqrt( sum( (r.r1.rating - u1_mean)^2) * sum( (r.r2.rating - u2_mean) ^2)) AS denom,u1, u2 WHERE denom <> 0 WITH u1, u2, nom/denom AS pearson ORDER BY pearson DESC LIMIT 10 MATCH (u2)-[r:WATCHED]->(m:movie) WHERE NOT EXISTS( (u1)-[:WATCHED]->(m) ) with m,sum(pearson*r.rating) as score MATCH (m)-[:OF_GENRE]->(g:genre) RETURN m.movieId as id ,m.title as title, collect(DISTINCT g.name) as gen, m.poster as poster, m.released as drelease, m.imdbRating as rating, m.duration as dur,0 as wn,score order by score desc LIMIT 5;



// i don't know
//MATCH ( u )-[ r : WATCHED ]->( m : movie ) WITH u , avg ( r . rating ) AS average MATCH ( u )-[ r : WATCHED ]->( m : movie ) WHERE r . rating > average MATCH ( m : movie )-[ s : MOVIE_SIM_MOVIE ]->( m1 : movie ) WHERE NOT EXISTS ( ( u)-[: WATCHED ]->( m1) ) with m1,s.relevance as x MATCH ( m1 : movie )-[ OF_GENRE ]->( g : genre ) RETURN m1.movieId as id ,m1.title as title, m1.poster as poster, m1.released as drelease, m1.imdbRating as rating, m1.duration as dur, COLLECT ( DISTINCT g.name) as gen, 0  as wn,x ORDER BY x desc LIMIT 5;