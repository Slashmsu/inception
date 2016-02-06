/**
 * Created by SlashMSU on 04.02.2016.
 */

var Product = require('../models/product');

module.exports = {

    findById: function(filter) {
        Product.findOne({ _id: filter._id }, function(err, result) {
            if (err) return next(err);
            return result;
        });
    },

    findByName: function(filter) {
        Product.findOne({ name: filter.name }, function(err, result) {
            if (err) return next(err);
            return result;
        });
    },

    findByNameLike: function(filter) {
        Product.find({ name: filter.name }, function(err, results) {
            if (err) return next(err);
            //return results;
            //todo Ask from Umed
        });
    },

    findByCategory: function(MongooseFilter) {//todo
        Product.find({ name: MongooseFilter.name }, function(err, results) {
            if (err) return next(err);
        });
    }


};