const bcrypt = require ('bcrypt-nodejs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({

    email: {type: String, unique: true, lowercase: true, require: true},
    password: {type: String, require: true},
    nickname: {type: String, require: true},
    userType: {type: String, require: true}

}, {
    timestamps: true
})

userSchema.pre('save', function(next){
    const user = this;
    if(!user.isModified('password')){
        return next();
    }

    bcrypt.genSalt(10, (err, salt) =>{
        if(err){
            next(err);
        }
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) {
                next(err);
            }
            user.password =hash;
            next();
        })  
    })
})
userSchema.methods.comparePassword = function(password, cb){
    bcrypt.compare(password, this.password, (err, same) => {
        if(err){
            return cb (err);
        }else{
            cb(null, same);
        }
    })
}

module.exports = mongoose.model('User', userSchema);
