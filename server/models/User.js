const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name : {
        type : String
    },
    email : {
        type : String,
        unique : true,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    number : {
        type : Number
    },
    details : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Details'
    },
    food : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Food'
    },
    plan : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Plan'
    },
    refreshToken : {
        type : String
    }
}, {timestamps : true})

const User = mongoose.model('User', UserSchema);

module.exports = User;