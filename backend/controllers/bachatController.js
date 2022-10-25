const Bachat = require('../models/bachat')
const moment = require('moment');
const User = require('../models/user')

const ErrorHandler =  require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

//create a new bachat
exports.createBachat = catchAsyncErrors(async (req, res, next) => {
    const isCreated = await Bachat.find({date: moment().format('MM YYYY')})
    const existed = isCreated[0]
    if(!isCreated.length>0){
      const bachat = await Bachat.create({
        date: moment().format('MM YYYY'),
        numOfCollections: 0,
        collected: [],

    })
    res.status(200).json({
        success: true,
        bachat: bachat
    })  
    }
    else{
        res.status(200).json({
            success: true,
            bachat: existed
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
            // console.log(file);
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

//Get unverified submission -ADMIN
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

//Verify Unsubmitted
exports.verifyUnsubmitted= catchAsyncErrors(async (req, res, next) => {
    const bachat = await Bachat.find({date: moment().format('MM YYYY')})
    
    // const isSubmitted = bachat[0].collected.length>0 ? bachat[0].collected.find({_id: req.user.id}).length>0 : false
    const isSubmitted = bachat[0].collected.find(b=>b.user.toString() === req.body.id.toString())
    const prevBachat = await Bachat.find({date: moment().subtract(1, "month").format('MM YYYY')})
    // const fined = prevBachat[0].collected.length>0 ? prevBachat[0].collected.find({_id: req.user.id}) : []
    const fined = prevBachat[0].collected.find(b=>b.user.toString() === req.body.id.toString())
    const collection = {
        user: req.body.id,
        name: req.body.name,
        amount: Number((fined ? bachat[0].primaryAmount : bachat[0].primaryAmount*2)),
        fine: Number((fined ? 0 : 100)),
        status: 'Verified'
    }
    
    
        if(!isSubmitted){
            try {
            const file = await Bachat.findById(bachat[0]._id)
            // console.log(file);
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
                message: 'Already submitted this month'
            })
        }
})

//Unverify submitted
exports.unverifySubmission = catchAsyncErrors(async (req, res, next)=>{
    const bachat = await Bachat.findById(req.params.bachatid)
    bachat.collected.pull({_id :req.params.collectid} )
    await bachat.save()
    res.status(200).json({
        success: true,
        message: 'Submission deleted successfully'
    })
})

//Fill all collection for a month
exports.fillAll = catchAsyncErrors(async (req, res, next) => {
    const bachat = await Bachat.findById(req.query.id)
    const users = await User.find({verified: true})
    users.forEach(user=>{
        bachat.collected.push({
            
                user: user._id,
                name: user.name,
                amount: 300,
                fine: 0,
                status: 'Verified'
            
        })
    })
    bachat.numOfCollections = users.length
    await bachat.save()
    res.status(200).json({
        success: true,
        message: 'All users set submitted successfully'
    })
})