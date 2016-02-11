/**
 * Created by SlashMSU on 04.02.2016.
 */

var Category = require('../models/category');

module.exports = {

    findById: function(MongooseFilter, callback) {
        Category.object.find({ _id: MongooseFilter._id }, function(err, results) {
            if (err) return next(err);
        });
    },

    findByName: function(MongooseFilter, next, callback) {
        Category.findOne({ name: MongooseFilter.name }, function(err, results) {
            if (err) return next(err);
            callback(results);
        });
    }


};