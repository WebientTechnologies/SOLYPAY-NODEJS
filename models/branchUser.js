const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const branchUsers = new mongoose.Schema(
    {
        merchantAdmin:  {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        branchType:{
            type:String,
            required:[true, "Branch Type is Required"],
            maxLength:255,
        },
        branch:{
            type: mongoose.Schema.Types.ObjectId,
            required:[true, "Branch Is Required"],
            ref: 'Branch'
        },
        fullName:{
            type:String,
            required:[true, "Name Is Required"],
            maxLength:255,
        },
        userId:{
            type:String,
            required:[true, "User Id Is Required"],
            maxLength:255,
        },
        password: {
            type:String,
            required:[true, "please enter your password"],
            minLength: [8, "Password must be at least 8 Characters"],
        },
        email:{
            type:String,
            required:false,
            unique:true,
            maxLength:255,
        },
        phone:{
            type:String,
            required:false,
            maxLength:255,
        },
        roles:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserRole',
            required:false,
        }],
        isCasher:{
            type:Boolean,
            default:false
        },
        canSyncronise:{
            type:Boolean,
            default:false
        },
        isActive:{
            type:Boolean,
            default:false
        },
    },
    {
        timestamps:true
    }
);

branchUsers.methods.getJwtToken = (user)=>{
    console.log([user])
    return jwt.sign({_id : user._id}, process.env.JWT_SECRETE,{
        expiresIn: '15d'
    });
}
branchUsers.methods.checkPasswordMatch = async(password,user)=>{
    return await bcrypt.compare(password, user.password);
}
module.exports = mongoose.model("BranchUser", branchUsers);