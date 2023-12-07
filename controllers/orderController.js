const Order = require('../models/order');
const Branch = require('../models/branch');
const BranchUser = require('../models/branchUser');
const CountryCity = require("../models/countryCity");
const DailyRate = require('../models/dailyRate');
const {catchError} = require('../middleware/CatchError');
const ErrorHandler = require("../utils/ErrorHandler");
const countryCity = require('../models/countryCity');

exports.createOrder = catchError(async(req, res, next) =>{
    const authenticatedUser = req.branchUser;

    const branchUserId = authenticatedUser._id;
    const {sender, senderPhone, senderAddress, beneficiary, beneficiaryPhone, beneficiaryCountry, beneficiaryCity, toBranchId, othAmount, othComm, usdAmount, usdComm, commPercentage, exRate, mode, remarks} = req.body;

    const userInfo = await BranchUser.findById(branchUserId).populate('branch', 'branch');
    const branchName = userInfo.branch.branch; 
    console.log(branchName);
    const fromBranchId = userInfo.branch._id;

    const branch = await Branch.findById(fromBranchId);
    const limit = parseFloat(branch.availableBalance);
    const amount = parseFloat(req.body.othAmount);

    console.log("Limit:", limit);
    console.log("othAmount:", amount);

    if (isNaN(limit) || isNaN(amount)) {
        return next(new ErrorHandler('Invalid limit or othAmount', 400));
    }

    if (limit < amount) {
        return next(new ErrorHandler('You have not sufficient limit to transfer Amount', 400));
    }
  

    const lastOrder = await Order.findOne({ fromBranchId: fromBranchId })
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
  const othcommission = othAmount * othComm /100;
  const othTotal = othAmount + othcommission;
  
  const usdcommission = usdAmount * usdComm /100;
  const usdTotal = usdAmount + usdcommission;
  console.log(branchUserId);
  console.log(remitNumber);
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
    beneficiaryCity,
    toBranchId,
    othAmount,
    othComm, 
    othTotal,
    usdAmount, 
    usdComm, 
    usdTotal,
    commPercentage, 
    exRate, 
    mode, 
    remarks

  });
    branch.availableBalance = branch.creditLimit - othAmount;
    branch.save();
    const savedOrder = await orderData.save();

    return res.status(201).json({order:savedOrder});
    
});


exports.generateReport = catchError( async (req, res, next) => {
      const authenticatedUser = req.branchUser;

      const user = authenticatedUser._id;
      const userInfo = await BranchUser.findById(user).populate('branch', 'branch');
      const branchName = userInfo.branch.branch; 
      console.log(branchName);
      const fromBranchId = userInfo.branch._id;
      const { sender, fromDate, toDate, toBranchId, status } = req.query;

      const filter = {};
      filter.user = user;
      filter.fromBranchId = fromBranchId;

      if (sender) {
          filter.sender = sender;
      }
      if (fromDate && toDate) {
          filter.createdAt = { $gte: new Date(fromDate), $lte: new Date(toDate) };
      }
      if (toBranchId) {
          filter.toBranchId = toBranchId;
      }
      if (status) {
          filter.status = status;
      }

      // Execute the query
      const report = await Order.find(filter);

      // Return the report as JSON
      res.status(200).json({ report });
  
});

exports.receivableList = catchError( async (req, res, next) => {
  const authenticatedUser = req.branchUser;

  const user = authenticatedUser._id;
  const userInfo = await BranchUser.findById(user).populate('branch', 'branch');
  const branchName = userInfo.branch.branch; 
  console.log(branchName);
  const fromBranchId = userInfo.branch._id;
  const { sender, senderPhone, remitNumber, toBranchId, beneficiary, beneficiaryPhone, status } = req.query;

  const filter = {};
  filter.user = user;
  filter.fromBranchId = fromBranchId;

  if (sender) {
      filter.sender = sender;
  }
  if (senderPhone) {
      filter.senderPhone = senderPhone;
  }
  if (remitNumber) {
      filter.remitNumber = remitNumber;
  }
  if (beneficiary) {
      filter.beneficiary = beneficiary;
  }
  if (beneficiaryPhone) {
      filter.beneficiaryPhone = beneficiaryPhone;
  }
  if (toBranchId) {
      filter.toBranchId = toBranchId;
  }
  if (status) {
      filter.status = status;
  }

  // Execute the query
  const report = await Order.find(filter);

  // Return the report as JSON
  res.status(200).json({ report });

});

exports.getCountry = catchError(async(req, res) =>{
  const authenticatedUser = req.branchUser;
  const user = authenticatedUser._id;
  const userInfo = await BranchUser.findById(user);
  const merchantAdmin = userInfo.merchantAdmin;
  const countries = await CountryCity.distinct('country', { merchantAdmin });
  res.status(200).json({countries});
});


exports.getCity = catchError(async(req, res) =>{
    const authenticatedUser = req.branchUser;
    const user = authenticatedUser._id;
    const userInfo = await BranchUser.findById(user);
    const merchantAdmin = userInfo.merchantAdmin;
    const country = req.params.country;
    const cities = await CountryCity.distinct('city', { merchantAdmin, country });
    res.status(200).json({cities});
});