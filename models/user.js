/**
 * Created by SlashMSU on 14.01.2016.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var Schema = mongoose.Schema;


// The user schema fields

var UserSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String,

    profile: {
        name: { type: String, default: ''},
        picture: { type: String, default: ''}
    },

    address: String,
    history: [{
        date: Date,
        paid: { type: Number, default: 0 }
    }]
});

// Hash the password before we even save it to the database

UserSchema.pre('save', function(next){
    var user = this;
    if(!user.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt){
        if(err) return next(err);
        bcrypt.hash(user.password, salt, null, function(err, hash){
            if(err) return next(err);
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.gravatar = function() {
  if (!this.size) size = 200;
  if (!this.email) return 'http://gravatar.com/avatar?s' + size + '&d=retro';
  var md5 = crypto.creatHash('md5').update(this.email).digest('hex');
  return 'http://gravatar.com/avatar?s'+ md5 + '?s= ' + size + '&d=retro';
};

// Compare password in the database and the one that the user

UserSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
