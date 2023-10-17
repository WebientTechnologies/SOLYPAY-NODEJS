const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");
const User = require("../models/User");

exports.isAuthenticated = async(req, res , next)=>{
    const {token} = req.cookies;

    if(!token) return next(new ErrorHandler('Not logged in', 401 ));

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRETE);
        
        const userId = decodedToken._id;
        console.log({userId, token,decodedToken})
        req.body.user = await User.findById(userId);
        next();
      } catch (err) {
        return next(new ErrorHandler('Invalid or expired token', 401));
      }
      
}