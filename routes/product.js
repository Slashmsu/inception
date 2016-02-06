var Product = require('../models/product');
var Category = require('../models/category');
var router = require('express').Router();
var crypto = require("crypto");
var mime = require('mime');

    //====================================
    // Private functions
    //====================================

    var multer = require('multer');
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/uploads/images')
        },
        filename: function (req, file, cb) {
            crypto.pseudoRandomBytes(16, function (err, raw) {
                cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
            });
        }
    });
    var uploading = multer({
        storage: storage,
        limits: {fileSize: 3000000, files:1}

    });

    //====================================
    // Routes functions
    //====================================

//======================================================================================================================
// Get products by category
//======================================================================================================================

    router.get('/products/:id', function(req, res, next) {
        Product
            .find({ category: req.params.id })
            .populate('category')
            .exec(function(err, products) {
                if (err) return next(err);
                res.render('main/category', {
                    products: products
                });
            });
    });

//======================================================================================================================
// Get product by id
//======================================================================================================================

    router.get('/product/:id', function(req, res, next) {
        Product
            .findById({ _id: req.params.id })
            .populate('category')
            .exec(function(err, product) {
                if (err) return next(err);
                res.render('product/product', {
                    product: product
                });
            });
    });

//======================================================================================================================
// Add product
//======================================================================================================================

    router.get('/add-product', function(req, res){
        res.render('product/add-product', {
          errors: req.flash('errors')
        });
    });

    router.post('/add-product', uploading.single('file'), function(req, res, next) {

        var product = new Product();

        Category.findById({ _id: req.body.category_id }, function(err, category) {
        if (err) return next(err);
            if(category) {
                product.category = category;
                product.name = req.body.name;
                product.price = req.body.price;
                product.image = '/uploads/images/' + req.file.filename;

                product.save(function(err){
                    if (err) return next(err);
                    req.flash('success', 'Successfully added a product');
                    return res.redirect('/');
                });
            }
        });

    });

//======================================================================================================================
// Edit product
//======================================================================================================================

    router.get('/edit-product/:id', function(req, res){
        Product
            .findOne({ _id: req.params.id })
            .populate('category')
            .exec(function(err, product) {

                if (err) return next(err);
                res.render('product/edit-product', {
                    product: product
                });
            });
    });

    router.post('/edit-product/:id', uploading.single('file'), function(req, res, next){
        if(res.locals.user)
            Product
                .findById({ _id: req.params.id })
                .populate('category')
                .exec(function(err, product) {
                    if (err) return next(err);

                    if (req.body.category_id)
                        Category
                            .findById({ _id: req.body.category_id })
                            .exec(function(err, category) {

                                if (err) return next(err);
                                product.category = category;

                                if (req.body.name) product.name = req.body.name;
                                if (req.body.price) product.price = req.body.price;
                                if (req.file && req.file.filename) product.image = '/uploads/images/' + req.file.filename;

                                product.save(function (err) {
                                    if (err) return next(err);
                                    return res.redirect('/product/' + req.params.id);
                                });
                        });
                });
        else
            res.redirect('/');
    });

//======================================================================================================================
// Export
//======================================================================================================================

module.exports = router;