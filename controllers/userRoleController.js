const UserRole  = require('../models/userRole');
const BranchUser = require('../models/branchUser');
const {catchError} = require('../middleware/CatchError');
const ErrorHandler = require("../utils/ErrorHandler");


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

exports.assignRolesToBranchUser = catchError(async (req, res, next) => {
        const {branchUserId, roleIds} = req.body;
        const branchUser = await BranchUser.findById(branchUserId);

        if (!branchUser) {
              return next(new ErrorHandler('BranchUser not found'));
        }
        const roles = await UserRole.find({ _id: { $in: roleIds } });

        if (!roles.length) {
              return next(new ErrorHandler('No roles found for the provided roleIds'));
        }
        branchUser.roles = roles.map(role => role._id);

        await branchUser.save();

        return res.status(200).json({ success: true, message: 'Roles assigned successfully' });

});
      
