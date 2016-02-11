/**
 * Created by SlashMSU on 04.02.2016.
 */

var Product = require('../models/product');
var Category = require('../models/category');

module.exports = {

    findById: function(filter, next, callback) {
        Product
            .findById({ _id: filter.id })
            .populate('category')
            .exec(function(err, product) {
                if (err) return next(err);
                callback(product);
            });
    },

    findAllByCategoryId: function(filter, next, callback) {
        Product
            .find({ category: filter.category_id })
            .populate('category')
            .exec(function(err, products) {
                if (err) return next(err);
                callback(products);
            });
    },

    findByCategoryNameLike: function(filter, next, callback) {
        Category.findOne({ name: { $regex: ".*" + filter.name + ".*" }}, function(err, result) {
            if (err) return next(err);
            Product
                .find({ category: result})
                .populate('category')
                .exec(function(err, results) {
                    callback(results)
                });
        });
    },

    removeById: function(userId, callback) {
        Product.remove({ _id: userId }, function(err) {
            if (!err) {
                console.log('notification!');
                callback('notification!');
            }
            else {
                console.log(err);
                callback(err);
            }
        });
    }

};