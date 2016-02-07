var router = require('express').Router();
var User = require('../models/user');
var Product = require('../models/product');
var Category = require('../models/category');
var productRepository = require('../repository/ProductRepository');

    function paginate(req, res, next) {

      var perPage = 9;
      var page = req.params.page;

      Product
        .find()
        .skip( perPage * page)
        .limit( perPage )
        .populate('category')
        .exec(function(err, products) {
          if (err) return next(err);
          Product.count().exec(function(err, count) {
            if (err) return next(err);
            res.render('main/product-main', {
              products: products,
              pages: count / perPage
            });
          });
        });
    }

    Product.createMapping(function(err, mapping) {
      if (err) {
        console.log("error creating mapping");
        console.log(err);
      } else {
        console.log("Mapping created");
        console.log(mapping);
      }
    });

    var stream = Product.synchronize();
    var count = 0;

    stream.on('data', function() {
      count++;
    });

    stream.on('close', function() {
      console.log("Indexed " + count + " documents");
    });

    stream.on('error', function(err) {
      console.log(err);
    });

    router.post('/search', function(req, res, next) {
      res.redirect('/search?q=' + req.body.q);
    });


    router.get('/search', function(req, res, next) {
        var MongooseFilter = require('../services/service-models/MongooseFilter');
        if (req.query.q) {
          MongooseFilter.name = req.query.q;
          console.log(req.query.q);
          //console.log(productRepository.findByNameLike(MongooseFilter));
          //Product.find({ name: filter.name }, function(err, results) {
          //    if (err) return next(err);
          //    //return results;
          //    //todo Ask from Umed
          //});

            Category.findOne({ name: /MongooseFilter.name/ }, function(err, result) {
                console.log(result);
                console.log('!!!');
                if (err) return next(err);
                Product
                    .find({ category: result})
                    .populate('category')
                    .exec(function(err, results) {
                        if (err) return next(err);
                        res.render('main/search-result', {
                            query: req.query.q,
                            data: results
                        });
                    });
            });

      }
    });

    router.get('/', function(req, res, next) {
        res.render('main/home');
    });

    router.get('/page/:page', function(req, res, next) {
      paginate(req,res,next);
    });

    router.get('/about', function(req, res) {
      res.render('main/about');
    });

//======================================================================================================================
// Export
//======================================================================================================================

module.exports = router;
