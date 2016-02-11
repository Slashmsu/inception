var router = require('express').Router();
var async = require('async');
var faker = require('faker');
var Product = require('../models/product');

var ProductRepository = require('../repository/ProductRepository');
var CategoryRepository = require('../repository/CategoryRepository');
var MongooseFilter = require('../services/service-models/MongooseFilter');

router.post('/search', function(req, res, next) {
    var MongooseFilter = require('../services/service-models/MongooseFilter');
    MongooseFilter.name = req.body.search_term;
    ProductRepository.findByCategoryNameLike(MongooseFilter, next, function(results) {
        res.json(results);
    });
});


router.get('/:name', function(req, res) {
    async.waterfall([
      function(callback) {
          MongooseFilter.name = req.params.name;
          CategoryRepository.findByName(MongooseFilter, function() {
              callback(null, category);
          });
      },

      function(category) {
        for (var i = 0; i < 30; i++) {
          var product = new Product();
          product.category = category._id;
          product.name = faker.commerce.productName();
          product.price = faker.commerce.price();
          product.image = faker.image.image();

          product.save();
        }
      }
    ]);
    res.json({ message: 'Success' });
});

module.exports = router;
