var mongoose = require('mongoose');
var passportLocalMongoose=require("passport-local-mongoose");

var UserSchema= new mongoose.Schema({
    username:    String,
    password:    String,
    firstName:   String,
    lastName:    String,
    avatar:      String,
    email:       String,
    description: String,
    avatarId:    String,
    followers: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    notifications:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Notification'
        }
    ],
    followings:[
        {
              type:mongoose.Schema.Types.ObjectId,
              ref: 'User'    
        }
    ]
});

UserSchema.plugin(passportLocalMongoose);
module.exports= mongoose.model("User",UserSchema);