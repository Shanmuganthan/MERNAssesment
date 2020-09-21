

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
    ObjectId = Schema.ObjectId;

var userShema = new Schema({
    email: String,
    mobile: String,
    emirate: String,
    time: { type: Date, default: Date.now() },
    dob : Date,
    firstName: String,
    lastName: String,
    password: String,
    RefId : ObjectId,
    Flag : { type: String , default : 'A' }
},
    {
        versionKey: false
    });


module.exports = mongoose.model('user', userShema, 'user');