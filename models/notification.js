var mongoose = require('mongoose');

var notificationSchema = new mongoose.Schema({
    avatar: String,
    typeOfN:String,
    campgroundId: String,
    username: String,
    userId : String,
    isRead : { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

module.exports= mongoose.model("Notification", notificationSchema);