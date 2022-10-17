const Notification = require('../models/notification')
const moment = require('moment')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

//Create a new Notification
exports.newNotification = catchAsyncErrors(async (req, res, next) => {
    const { title, content } = req.body;
    const notification = await Notification.create({
        date: moment().format('MMMM Do YYYY, h:mm a'),
        title,
        content
    })
    res.status(200).json({
        success: true,
        message: 'Notification created successfully'
    })
})

//Get all notifications
exports.getAllnotifications = catchAsyncErrors(async (req, res, next) => {
    const notifications = await Notification.find()
    res.status(200).json({
        success: true,
        notifications
    })
})

//Set a notification seen
exports.seeNotification = catchAsyncErrors(async (req,res)=>{
    const notification = await Notification.findById(req.query.id) 
    console.log(notification);
    const isSeen = notification.seen.find(one=> one._id.toString() === req.user._id.toString())
    if(isSeen){
        res.status(404).json({
            success: false,
            message: 'Already seen'
        })
    }
    else{
        notification.seen.push(req.user.id)
    await notification.save({validateBeforeSave: false})
    res.status(200).json({
        success: true,
        message: 'Set seen successfully'
    })
    }
    
})

//Set all notification seen
exports.seeAllNotifications = catchAsyncErrors(async (req, res, next) => {
    const notifications = await Notification.find()
    const notseen = notifications.filter(each=> !((each.seen.toString()).includes(req.user._id.toString())))
    if(notseen.length>0){
       notseen.forEach(async(item)=>{
        
        item.seen.push(req.user.id)
        await item.save({validateBeforeSave: false})
    })
    res.status(200).json({
        success: true,
        message: 'All notifications set to seen'
    }) 
    }
    else{
        res.status(404).json({
            success: false,
            message: 'No notifications unseen'
        })
    }
    
})