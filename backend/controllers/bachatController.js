const Bachat = require('../models/bachat')
const moment = require('moment');

const ErrorHandler =  require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')

//create a new bachat
exports.createBachat = catchAsyncErrors(async (req, res, next) => {
    const isCreated = await Bachat.find({date: moment().format('MM YYYY')})
    console.log(isCreated);
    if(!isCreated.length>0){
      const bachat = await Bachat.create({
        date: moment().format('MM YYYY'),
        numOfCollections: 0,
        collected: [],

    })
    res.status(200).json({
        success: true,
        bachat
    })  
    }
    else{
        res.status(201).json({
            success: false,
            message: 'bachat already exists'
        })
    }
    
})

//Get data of month
exports.getMonthData = catchAsyncErrors(async (req, res, next) => {
    const monthData = await Bachat.find({date: req.params.month})
    if(monthData.length>0){
        res.status(200).json({
            success: true,
            data: monthData
        })
    }
    else{
        res.status(401).json({
            success: false,
            message: `bachat for month ${req.params.month} not found`
        })
    }
})