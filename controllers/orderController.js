const Order = require('../models/order');
const Branch = require('../models/branch');
const BranchUser = require('../models/branchUser');
const DailyRate = require('../models/dailyRate');
const {catchError} = require('../middleware/CatchError');
const ErrorHandler = require("../utils/ErrorHandler");

exports.createOrder = catchError(async(req, res, next) =>{
    const authenticatedUser = req.branchUser;

    const branchUserId = authenticatedUser._id;
    const {sender, senderPhone, senderAddress, beneficiary, beneficiaryPhone, beneficiaryCountry, toBranchId, etbAmount, etbComm, usdAmount, usdComm, commPercentage, exRate, mode, remarks} = req.body;

    const userInfo = await BranchUser.findById(branchUserId).populate('branch', 'branch');
    const branchName = userInfo.branch.branch; 
    console.log(branchName);
    const fromBranchId = userInfo.branch._id;

    const branch = await Branch.findById(fromBranchId);
    const limit = branch.creditLimit;
    if(limit < etbAmount){
        return next(new ErrorHandler('You have not sufficiant limit to transfer Amount', 400));
    }

    const lastOrder = await Order.findOne({ user: branchName })
    .sort({ createdAt: -1 }) 
    .select('remitNumber')
    .exec();

  let newSerialNumber = '00000001';

  if (lastOrder && lastOrder.remitNumber) {
    const lastSerialNumber = lastOrder.remitNumber.slice(branchName.length);
    const lastSerialNumberInt = parseInt(lastSerialNumber, 10);

    if (!isNaN(lastSerialNumberInt)) {
      newSerialNumber = (lastSerialNumberInt + 1).toString().padStart(8, '0');
    }
  }
  const remitNumber = branchName + newSerialNumber;
  const etbcommission = etbAmount * etbComm /100;
  const etbTotal = etbAmount + etbcommission;
  
  const usdcommission = usdAmount * usdComm /100;
  const usdTotal = usdAmount + usdcommission;
  const orderData = new Order({
    user: branchUserId, // Use the ObjectId of the authenticated user
    remitNumber: remitNumber, // Generate the remitNumber as discussed earlier
    sender,
    senderPhone,
    senderAddress,
    fromBranchId,
    beneficiary,
    beneficiaryPhone,
    beneficiaryCountry,
    toBranchId,
    etbAmount,
    etbComm, 
    etbTotal,
    usdAmount, 
    usdComm, 
    usdTotal,
    commPercentage, 
    exRate, 
    mode, 
    remarks

  });

    const savedOrder = await orderData.save();

    return res.status(201).json({order:savedOrder});
    
})
