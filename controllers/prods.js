const Prod = require('../models/prod');
const pool= require('../utils/database');

exports.get_test = (req,res,next) => {
	pool.query('SELECT * FROM products',(err,res1)=>{
		if(err) console.log(err);
		else {
			res.render('prods', {
		        pageTitle: 'All Products',
		        path: '/prods',
		        itlist: res1.rows
	    	});
		}
	});    
};