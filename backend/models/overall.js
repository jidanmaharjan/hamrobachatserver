const mongoose = require('mongoose')

const overallSchema = new mongoose.Schema({
    totalSavings: {
        type: Number,

    },
    totalFine:{
        type: Number,
    },
    totalWithdraw:{
        type: Number,
    }
})

module.exports = mongoose.model('Overall',overallSchema)