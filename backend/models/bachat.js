const mongoose = require('mongoose');

const bachatSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    primaryAmount:{
        type: Number,
        default: 300
    },
    numOfCollections: {
        type: Number,
        default: 0,
    },
    collected: [{
        user:{
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            required: true,
        },
        amount:{
            type: Number,
            required: true
        },
        fine: {
            type: Number,
            required: true,
        },
        collectDate:{
            type: Date,
            default: Date.now,
            required: true
        },
        status:{
            type: String,
            required: true,
        }  
    }]
})

module.exports = mongoose.model('Bachat',bachatSchema)