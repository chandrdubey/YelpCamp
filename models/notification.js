var mongoose = require('mongoose');

var notificationSchema = new mongoose.Schema({
    avatar: String,
    campgroundId: String,
    username: String,
    userId : String,
    isRead : { type: Boolean, default: false }
});

module.exports= mongoose.model("Notification", notificationSchema);