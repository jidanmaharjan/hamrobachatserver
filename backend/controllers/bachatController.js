const Bachat = require('../models/bachat')
const moment = require('moment');

const ErrorHandler =  require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

//create a new bachat
exports.createBachat = catchAsyncErrors(async (req, res, next) => {
    const isCreated = await Bachat.find({date: moment().format('MM YYYY')})
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

//Get all month data
exports.getAllMonths = catchAsyncErrors(async (req, res, next) => {
    const data = await Bachat.find()

    try {
        res.status(200).json({
            success: true,
            data: data
        })
    } catch (error) {
        res.status(400).json({error: error})
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

//Submit by user
exports.submitRequest = catchAsyncErrors(async (req, res, next) => {
    const bachat = await Bachat.find({date: moment().format('MM YYYY')})
    
    // const isSubmitted = bachat[0].collected.length>0 ? bachat[0].collected.find({_id: req.user.id}).length>0 : false
    const isSubmitted = bachat[0].collected.find(b=>b.user.toString() === req.user._id.toString())
    const prevBachat = await Bachat.find({date: moment().subtract(1, "month").format('MM YYYY')})
    // const fined = prevBachat[0].collected.length>0 ? prevBachat[0].collected.find({_id: req.user.id}) : []
    const fined = prevBachat[0].collected.find(b=>b.user.toString() === req.user._id.toString())
    const collection = {
        user: req.user._id,
        name: req.user.name,
        amount: Number((fined ? bachat[0].primaryAmount : bachat[0].primaryAmount*2)),
        fine: Number((fined ? 0 : 100)),
        status: 'Unverified'
    }
    
    
        if(!isSubmitted){
            try {
            const file = await Bachat.findById(bachat[0]._id)
            console.log(file);
            file.collected.push(collection)
            file.numOfCollections = file.collected.length
            await file.save({validateBeforeSave: false})
            res.status(200).json({
                success: true,
            })
        } catch (error) {
        res.status(400).json(error)
        }
        }
        else{
            res.status(201).json({
                success: false,
                message: 'You have already submitted this month'
            })
        }
    
})

//Get submit Status
exports.getSubmitDetails = catchAsyncErrors(async (req, res, next) => {
    const bachat = await Bachat.find({date: moment().format('MM YYYY')})
    const isSubmitted = bachat[0].collected.find(b=>b.user.toString() === req.user._id.toString())
    try {
       if(!isSubmitted){
        res.status(200).json({
            success: true,
            status: 'Unsubmitted'
        })
    }
    else{
        res.status(200).json({
            success: true,
            status: isSubmitted.status,
            amount: isSubmitted.amount,
            fine: isSubmitted.fine,
            submitDate: moment(isSubmitted.collectDate).format('DD MMMM YYYY')
        })
    } 
    } catch (error) {
        res.status(400).json({ error: error})
    }
    
})

//Get unverified users -ADMIN
exports.getUnverifiedUsers = catchAsyncErrors(async (req, res, next) => {
    const bachat = await Bachat.find({date: moment().format('MM YYYY')})
    const unverified = []
    bachat[0].collected.forEach(element => {
        if(element.status === 'Unverified')unverified.push( element)
    });
    
    try {
        res.status(200).json({
            success: true,
            data: unverified
        })
    } catch (error) {
        res.status(400).json({ error: error})
    }
})

//Verify submission - ADMIN
exports.verifySubmission= catchAsyncErrors(async (req, res, next) => {
    const bachatId = await Bachat.find({date: moment().format('MM YYYY')})
    
    try {
        const bachat = await Bachat.findById(bachatId[0]._id)
        bachat.collected.forEach(collection=>{
            if(collection._id.toString() === req.query.collectId.toString()){
                collection.status = 'Verified'
            }
        })
        await bachat.save({ validateBeforeSave: false})
        res.status(200).json({
            success: true,
        })
    } catch (error) {
        res.json({ error: error })
    }
})