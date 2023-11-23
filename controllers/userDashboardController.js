const Order = require('../models/order');
const {catchError} = require('../middleware/CatchError');
const Branch = require('../models/branch');

exports.userDashboard = catchError(async(req, res) =>{
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const authenticatedUser = req.branchUser;
    console.log(authenticatedUser);
    // Get today's total order (total of usdAmount)
    const todayTotal = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: today },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: { $toDouble: '$usdAmount' } },
          },
        },
      ]);
  
      // Get the total orders with status "ready"
      const readyTotal = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: today },
            status: 'ready',
          },
        },
        {
          $count: 'total',
        },
      ]);
      const branchId = authenticatedUser.branch; 
      const branch = await Branch.findById(branchId);

      // Get the total orders with status "paid"
      const paidTotal = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: today },
            status: 'paid',
          },
        },
        {
          $count: 'total',
        },
      ]);
  
      return res.status(200).json({
        todayTransaction: todayTotal.length > 0 ? todayTotal[0].total : 0,
        readyTransaction: readyTotal.length > 0 ? readyTotal[0].total : 0,
        paidTransaction: paidTotal.length > 0 ? paidTotal[0].total : 0,
        creditLimit: branch.creditLimit,
        usedBalance: branch.creditLimit - branch.availableBalance,
        creditBalance: branch.availableBalance,

      });
})