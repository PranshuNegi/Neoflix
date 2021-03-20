const Movie = require('../models/user');

exports.get_test = (req,res,next) => {
	res.render('filters', {
        pageTitle: 'Filters',
        path: '/filters',
        genre: ["Romantic","Comedy","Animation","Drama","Action","Thriller","Horror","Biography","Mythological"],
        language: ["Hindi","English","French","Spanish","Telugu","Tamil","Malayalam","Bengali"]
    });
};