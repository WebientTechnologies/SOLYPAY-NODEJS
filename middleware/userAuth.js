const jwt = require("jsonwebtoken");
const BranchUser = require("../models/branchUser");
const { catchError } = require("./CatchError");

exports.userAuth = catchError(async(req, res , next) => {
 
    let token;
    // Check for token in Authorization header
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    if (!token) {
      token = req.cookies.token;
    }
    if (!token) {
        return res.status(401).json({
            success:false,
            message:'Not Logged In',
      })
    }
    console.log(token);
    
        const decodedToken = jwt.verify(token, process.env.JWT_SECRETE);
        
        const branchUserId = decodedToken._id;
        console.log({branchUserId, token,decodedToken})
        req.branchUser = await BranchUser.findById(branchUserId);
        next();
     
});
