/**
 * Created by SlashMSU on 04.02.2016.
 */

var User = require('../models/user');

module.exports = {

    findById: function(userId, next, callback) {
        User.findOne({ _id: userId}, function(err, user){
            if (err) return next(err);
            callback(user);
        });
    },

    removeById: function(userId) {
        User.remove({ _id: userId }, function(err) {
            if (!err) {
                console.log('notification!');
            }
            else {
                console.log('error!');
            }
        });
    }

};