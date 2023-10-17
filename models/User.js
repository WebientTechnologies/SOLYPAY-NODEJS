const { config } = require("dotenv");
const jwt = require("jsonwebtoken");
const { default: mongoose, models } = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');


config();
const User = new mongoose.Schema({
    name : {
        type: String,
        required: [true, "please enter you Name"],
        minLength: [4, "name must be at least 8 Characters"],
    },
    email : {
        type: String,
        required: [true, "please enter you Email"],
        unique: true,
      validate : validator.isEmail
    },
    password :{
        type: String,
        required: [true, "please enter your password"],
        minLength: [8, "Password must be at least 8 Characters"],
        select : false,
    },
    role : {
        type : String ,
        enum : ['admin', 'merchant admin' ],
        default : 'merchant admin'
    },
    subscription: {
        id: String,
        status:String
    },
    
    avatar :{
        public_id : {
            type:String,
            required:true,
        },
        url : {
            type:String,
            required:true,
        },

    },
  
    resetPasswordToken : String,
    resetPasswordExpire : String
}, {
    timestamps: true,
});


User.methods.getJwtToken = (user)=>{
    console.log([user])
    return jwt.sign({_id : user._id}, process.env.JWT_SECRETE,{
        expiresIn: '15d'
    });
}
User.methods.checkPasswordMatch = async(password,user)=>{
    return await bcrypt.compare(password, user.password);
}
User.methods.createResetToken = async(user)=>{
    let resetToken = crypto.randomBytes(20).toString('base64');
    resetToken = resetToken.replace(/[^A-Za-z0-9\-_.~]/g, ''); // Remove non-URL-safe characters


    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = new Date(Date.now()+ 1000 + 60 + 15);
    await user.save();
    return resetToken;
}

User.pre('save', async function (next){
    if(this.isModified ('password'))
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

module.exports = mongoose.model('User', User);