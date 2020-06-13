const mongoose = require('mongoose');
const bcrypt = require('bcryot');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique:1
    },
    password: {
        type: String,
        minnlength:5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    token: {
        type: String
    },
    tokenExp : {
        type: Number
    }
})

userSchema.pre('save', (next) => {
    let user = this;
    if (user.Modified('password')){
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) return next(err);
    
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) return next(err);
                user.password = hash;
            })
        })
    } else {
        next();
    }
    
});

userSchema.methods.comparePassword = (plainPassword, cb) => {
    bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = (cb) => {
    let user = this;
    let token = jwt.sign(user._id.toHexString(), 'secret')

    user.token = token;
    user.save((err, user) => {
        if (err) return cb(err);
        cb(null, user)
    })
}

userSchema.static.findByTOken = (token, cb) => {
    let user = this;
    jwt.verify(token,'secret', (err, decode) => {
        user.findOne({"_id": decode, "token": token}, (err, user) => {
            if(err) return cb(err);
            cb(null, user);
        })
    })
}

const User = mongoose.model('User', userSchema);

module.exports = { User };