const Prod = require('../models/prod');
const pool= require('../utils/database');
const pool1= require('../utils/database');
const pool2= require('../utils/database');
exports.get_test = (req,res,next) => {


    
    pool.query('SELECT item_id, cart.quantity as quantity, title, price, image FROM cart, products where products.id=cart.item_id',(err,res1)=>{
        pool1.query('SELECT credit FROM users WHERE user_id=1',(err,res2)=>{
            if(err) console.log(err);
            else {
                res.render('cart', {
                    pageTitle: 'Cart',
                    path: '/cart',
                    credits: (res2.rows)[0].credit,
                    itlist: res1.rows
                });
            }
        }); 
    });

};

exports.post_test = (req,res,next) => {
    const id = req.body.product_id;
    var pq;
    pool.query('SELECT quantity FROM products WHERE id = $1',[id,],(err,res1)=>{
        if(err) console.log(err);
		else{
            pq = (res1.rows)[0].quantity;
            if(pq<1) res.redirect('/prods');
            else{
                pool1.query('UPDATE products SET quantity = quantity - 1 WHERE id = $1',[id,],(err)=>{
                    if(err) console.log(err);
                    else{
                    pool2.query('insert into cart(user_id, item_id, quantity) values (1, $1, 1) on conflict (user_id, item_id) do update set quantity=cart.quantity+1',[id,],()=>{
                    res.redirect('/cart');})
                }
            })
        }
    }
})
};