const User = require('../models/user')

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const crypto = require('crypto');

// Register a new user => /api/v1/register
exports.registerUser = catchAsyncErrors ( async (req, res, next) => {

    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        
    })
    
    res.status(200).json({
        success: true,
        message: 'User created successfully'
    })
})

//Login User => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req,res, next) => {
    const {email, password} = req.body;

    // Check if email and password is entered by user
    if(!email || !password) {
        return next(new ErrorHandler('Please enter email and password'));
    }

    // Finding user in database
    const user = await User.findOne({email}).select('+password')
    if(!user){
        return next (new ErrorHandler('Invalid Email or Password', 401));
    }

    // Check if password is correcct or not
    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched) {
        return next (new ErrorHandler('Invalid Email or Password', 401));
    }

    //Check if user is verified or not
    const isVerified = await user.verified;

    if(!isVerified) {
        return next (new ErrorHandler('You are not verified user', 401));
    }

    sendToken(user, 200, res)
})



// Get curretly logged in user details => /api/v1/profile
exports.getUserProfile = catchAsyncErrors(async(req, res, next) =>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
})

// Update or change password => /api/v1/passsword/update
exports.updatePassword = catchAsyncErrors(async(req, res, next) =>{
    const user = await User.findById(req.user.id).select('+password');

    //Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword)
    
    if(!isMatched){
        return next(new ErrorHandler('Old password is incorrect'));
    }

    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res)
})

//Update user profile => /api/v1/profile/update
exports.updateProfile = catchAsyncErrors(async(req, res, next) =>{
    const newUserData ={
        name: req.body.name,
        email: req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData,{
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
    })
})

//Logout user => /api/v1/logout
exports.logout = catchAsyncErrors(async (req,res,next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    })
})


//Admin routes

// Reset Password => /api/v1/admin/password/reset/
exports.resetPassword = catchAsyncErrors(async (req,res, next) => {
    const user = await User.findById(req.params.id).select('+password');
   
    user.password = "123456";

    await user.save();
    res.status(200).json({
        success: true,
        message: `Password for ${user.name} reset to 123456 successfully`
    })
})

// Get all users => /api/v1/admin/users
exports.allUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find()

    res.status(200).json({
        success: true,
        users
    })
})

// Get a user detail => /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`));
    }

    res.status(200).json({
        success: true,
        user
    })
})

//Update user profile => /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async(req, res, next) =>{
    const newUserData ={
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData,{
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
    })
})

//Delete user profile => /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async(req, res, next) =>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`));
    };

    await user.remove();
    res.status(200).json({
        success: true,
    })
})