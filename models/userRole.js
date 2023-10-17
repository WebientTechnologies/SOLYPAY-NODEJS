const mongoose = require("mongoose");

const userRoles = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true, "Name Is Required"],
            unique:[true, "Role Should be Unique"],
            maxLength:255,
        },
        createdAt:{
             type:Date,
             required:true,
             default:Date.now(),
         },
         updatedAt:{
             type:Date,
             required:true,
             default:Date.now(),
         }
    }
);
module.exports = mongoose.model("UserRole", userRoles);