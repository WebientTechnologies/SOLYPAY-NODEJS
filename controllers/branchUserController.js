const BranchUser = require('../models/branchUser');
const UserRole  = require('../models/userRole');
const {catchError} = require('../middleware/CatchError');
const bcrypt = require('bcryptjs');
require("dotenv").config();
const jwt = require('jsonwebtoken');
const ErrorHandler = require("../utils/ErrorHandler");
const { sendToken } = require('../utils/sendToken');


exports.createUser = catchError(async(req, res) =>{
        const authenticatedUser = req.user;

        const merchantAdmin = authenticatedUser._id;
        const {branchType, branch, fullName, userId, email, password, phone, isCasher, canSyncronise, isActive} = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new BranchUser({merchantAdmin, branchType, branch, fullName, userId, email, password:hashedPassword, phone, isCasher, canSyncronise, isActive});
        const savedUser = await newUser.save();
        return res.status(200).json({user:savedUser});
    
});



exports.loginBranchUser = catchError(async (req, res, next) => {
  const { userId, password } = req.body;
  if (!userId || !password)
    return next(new ErrorHandler("Please Enter All Felids", 400));
  const user = await BranchUser.findOne({ userId }).select("+password").exec();
  console.log({ user });
  if (!user)
    return next(
      new ErrorHandler("Please enter correct email or password", 401)
    );
  const isPassword = await user.checkPasswordMatch(password, user);
  if (!isPassword)
    return next(
      new ErrorHandler("Please enter correct email or password", 401)
    );

  sendToken(res, user, `welcome back ${user.name}`, 200);
});

exports.getMyUsers = catchError(async(req, res) =>{
    const authenticatedUser = req.user;

    const merchantAdmin = authenticatedUser._id;

    const users = await BranchUser.find({merchantAdmin:merchantAdmin}).populate('branch').populate('roles', 'name').exec();
    return res.status(200).json({users:users});

})
