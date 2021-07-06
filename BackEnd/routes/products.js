const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');

/* GET ALL PRODUCTS */
router.get('/', function (req, res) {
  let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1;
  const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 20;   // set limit of items per page
  let startValue;
  let endValue;
  if (page > 0) {
    startValue = (page * limit) - limit;     // 0, 10, 20, 30
    endValue = page * limit;                  // 10, 20, 30, 40
  } else {
    startValue = 0;
    endValue = 10;
  }
  database.table('products as p')
      .join([
        {
          table: "categories as c",
          on: `c.id = p.cat_id`
        }
      ])
      .withFields(['c.title as category',
        'p.title as name',
        'p.price',
        'p.quantity',
        'p.description',
        'p.image',
        'p.id'
      ])
      .slice(startValue, endValue)
      .sort({id: .1})
      .getAll()
      .then(prods => {
        if (prods.length > 0) {
          res.status(200).json({
            count: prods.length,
            products: prods
          });
        } else {
          res.json({message: "No products found"});
        }
      })
      .catch(err => console.log(err));
});

router.post('/add', async (req, res) => {
  let {id,title,image,images,description,price,quantity,category,cat_id} = req.body;
    database.table('products')
        .insert({
          id: id,
          title:title,
          image:image,
          images:images,
          description:description,
          price:price,
          quantity:quantity,
          short_desc:category,
          cat_id:cat_id
        }).catch(err => console.log(err));
    res.json({
    message: `Product Added`});
});

router.put('/update/:prodId', function (req, res) {
    let productId = req.params.prodId;
    let {title,image,images,description,price,quantity,category,cat_id} = req.body;
    database.table('products')
        .filter({id: productId})
        .update({
            title:title,
            image:image,
            images:images,
            description:description,
            price:price,
            quantity:quantity,
            short_desc:category,
            cat_id:cat_id
        }).catch(err => console.log(err));
    res.json({
        message: `Product Updated`});
});

/ * GET ONE PRODUCT*/
router.get('/:prodId', (req, res) => {
  let productId = req.params.prodId;
  database.table('products as p')
      .join([
        {
          table: "categories as c",
          on: `c.id = p.cat_id`
        }
      ])
      .withFields(['c.title as category',
        'p.title as name',
        'p.price',
        'p.quantity',
        'p.description',
        'p.image',
        'p.id',
        'p.images'
      ])
      .filter({'p.id': productId})
      .get()
      .then(prod => {
        console.log(prod);
        if (prod) {
          res.status(200).json(prod);
        } else {
          res.json({message: `No product found with id ${productId}`});
        }
      }).catch(err => res.json(err));
});


module.exports = router;
