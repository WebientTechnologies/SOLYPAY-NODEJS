const DailyRate = require('../models/dailyRate');
const Branch = require('../models/branch');
const {catchError} = require('../middleware/CatchError');

exports.setDailyRate = catchError(async(req, res, next) =>{
    const authenticatedUser = req.user;
    const merchantAdmin = authenticatedUser._id;
    const {fromBranch, toBranch, rate, remitCommissionPercentage, payCommissionPercentage, shortBy, isInverse} =  req.body;
    const dailyRateData = {
        merchantAdmin: merchantAdmin, 
        fromBranch,
        toBranch,
        rate,
        remitCommissionPercentage,
        payCommissionPercentage,
        shortBy,
      };
  
      let data = null;
      let dailyRate = null;
      const existingRate = await DailyRate.findOne({ fromBranch, toBranch });
      if(existingRate){
        dailyRate =  existingRate.set(dailyRateData);
      }else{
        dailyRate = new DailyRate(dailyRateData);
      }
      
      if (isInverse) {
        const reversedRateData = {
          ...dailyRateData,
          fromBranch: toBranch,
          toBranch: fromBranch,
        };
        let reversedRate = null;
        const existingReverseRate = await DailyRate.findOne({ fromBranch:toBranch, toBranch:fromBranch });
        if(existingReverseRate){
            reversedRate =  existingReverseRate.set(reversedRateData);
          }else{
            reversedRate = new DailyRate(reversedRateData);
          }
  
        await Promise.all([dailyRate.save(), reversedRate.save()]);
        data = [{dailyRate}, {reversedRate}]
      } else {
        await dailyRate.save();
        data = [{dailyRate}];
      }
  
      return res.status(201).json({ message: 'Daily rate created successfully', data: data});
})