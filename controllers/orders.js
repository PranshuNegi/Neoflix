const Prod = require('../models/prod');
const pool= require('../utils/database');
const pool1 = require('../utils/database');
const pool2 = require('../utils/database');
const pool3 = require('../utils/database');
const pool4 = require('../utils/database');
const pool5 = require('../utils/database');
exports.get_test = (req,res,next) => {
	pool.query('SELECT item_id, orders.quantity as quantity, title, price, image FROM orders, products where products.id=orders.item_id',(err,res1)=>{
		if(err) console.log(err);
		else {
			res.render('orders', {
		        pageTitle: 'Orders',
		        path: '/orders',
		        itlist: res1.rows
	    	});
		}
	});    
};

exports.post_test = (req,res,next) => {
	pool5.query('select count(*) as cnt from cart',(err,res3)=>{
		var cnt = (res3.rows)[0].cnt;
		if(cnt == 0){
			res.redirect('/cart');
		}
	else{
    pool.query('select sum(price*cart.quantity) as cred_required from cart,products where cart.item_id=products.id',(err,res1)=>{
		pool1.query('SELECT credit FROM users WHERE user_id=1',(err,res2)=>{
		if(err) console.log(err);
		else {
			var cred=(res2.rows)[0].credit;
			var cred_required=(res1.rows)[0].cred_required;
			var new_cred = cred - cred_required;
			if (new_cred >= 0){
				pool2.query('update users set credit = $1',[new_cred,],()=>{
				pool3.query('insert into orders (user_id, item_id, quantity) select user_id , item_id , quantity from cart on conflict (user_id,item_id) do update set quantity=orders.quantity+excluded.quantity',()=>{
					pool4.query('delete from cart',()=>{
					res.redirect('/orders');
					});
				});
			});
			}
			else{
				res.redirect('/cart');
			}
		}
	});
	});
	}
});  
};