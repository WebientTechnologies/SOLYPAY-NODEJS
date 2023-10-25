const Order = require('../models/order');
const Branch = require('../models/branch');
const DailyRate = require('../models/dailyRate');
const {catchError} = require('../middleware/CatchError');

exports.createOrder = catchError(async(req, res, next) =>{
    
})
