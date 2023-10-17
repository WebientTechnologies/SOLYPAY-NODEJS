const BranchUser = require('../models/branchUser');
const UserRole  = require('../models/userRole');
const {catchError} = require('../middleware/CatchError');
const bcrypt = require('bcryptjs');
require("dotenv").config();
const jwt = require('jsonwebtoken');
const ErrorHandler = require("../utils/ErrorHandler");


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

exports.loginBranchUser = catchError(async (req,res, next) => {

        const {email, password} = req.body;
        //validation on email and password
        if(!email || !password) {
          return next(new ErrorHandler("PLease fill all the details carefully", 400));
           
        }

        //check for registered user
        let user = await BranchUser.findOne({email});
        //if not a registered user
        if(!user) {
          return next(new ErrorHandler("User is not registered", 400));
        }
        console.log(user._id)

        const payload = {
            email:user.email,
            _id:user._id,
            role:user.roles,
        };
        //verify password & generate a JWT token
        if(await bcrypt.compare(password,user.password) ) {
            //password match
            let token =  jwt.sign(payload, 
                                process.env.JWT_SECRET,
                                {
                                    expiresIn:"15d",
                                });
                  
            user = user.toObject();
            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date( Date.now() + 15 * 24 * 60 * 60 * 1000),
                httpOnly:true,
                sameSite: 'none',
                secure: true,
            }

            

            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message:'User Logged in successfully',
            });
        }
        else {
          return next(new ErrorHandler("Password Incorrect", 401));
        }
});
