const UserRole  = require('../models/userRole');
const {catchError} = require('../middleware/CatchError');


exports.createRole = catchError(async(req, res) =>{
        const {name} = req.body;
        const newRole = new UserRole({name});
        const savedRole = await newRole.save();
        return res.status(200).json({role:savedRole});
    
});

exports.getRole = catchError(async(req, res) =>{
    
        const role = await UserRole.find();
        return res.status(200).json({roles:role});  
   
});
