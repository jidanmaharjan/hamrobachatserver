const Overall = require('../models/overall')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

exports.changeOverall= catchAsyncErrors(async (req, res, next) => {
    const values = {
        totalSavings: req.body.totalSavings,
        totalFine: req.body.totalFine,
        totalWithdraw: req.body.totalWithdraw
    }
    const overall = await Overall.findByIdAndUpdate('6352c13785ccf0f661ca19b9',values,{
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        overall
    })
})