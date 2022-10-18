const  mongoose  = require("mongoose");

const notificationSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    seen: [{
        user:{
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        }

    }],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    expireAt: {
        type: Date,
        default: Date.now()+30*24*60*60
    }
})

module.exports = mongoose.model('Notification',notificationSchema)