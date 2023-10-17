const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");
const User = require("../models/User");
const { catchError } = require("./CatchError");

exports.isAuthenticated = catchError(async(req, res , next)=>{
  let token = null
// Check for token in Authorization header
    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    if (!token) {
      token = req.cookies.token;
    }

  if(!token) return next(new ErrorHandler('Not logged in', 401 ));

  try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRETE);
      const userId = decodedToken._id;
      console.log({userId, token,decodedToken})
      req.user = await User.findById(userId);
      next();
    } catch (err) {
      return next(new ErrorHandler('Invalid or expired token', 401));
    }
    
})

exports.isAdmin = (req,res,next) => {
  try{
          if(req.user.role !== "admin") {
              return res.status(405).json({
                  success:false,
                  message:'This is a protected route for Admin',
              });
          }
          next();
  }
  catch(error) {
      return res.status(405).json({
          success:false,
          message:'Method not allowed',
      })
  }
}

exports.isMerchantAdmin = (req,res,next) => {
  try{
      if(req.user.role !== "merchant admin") {
          return res.status(405).json({
              success:false,
              message:'This is a protected route for merchant admin',
          });
      }
      next();
}
catch(error) {
  return res.status(405).json({
      success:false,
      message:'Method not allowed',
  })
}
}

