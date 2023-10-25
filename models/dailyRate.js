const mongoose = require("mongoose");

const dailyReates = new mongoose.Schema(
  {
    merchantAdmin:  {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    fromBranch: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "From Branch is required"],
      ref: 'Branch'
    },
    toBranch: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "To Branch is required"],
      ref: 'Branch'
    },
    rate: {
      type: Number,
      required: [true, "rate is required"],
    },
    remitCommissionPercentage: {
      type: String,
      required: [true, "remmit coomission is required"],
      maxlength: 255, 
    },
    payCommissionPercentage: {
      type: String,
      required: false,
      maxlength: 255, 
    },
    shortBy: {
        type: String,
        required: false,
        enum : ['Branch', 'Currency', 'Date Created' ],
      },
  },
   {
    timestamps: true,
}
);

module.exports = mongoose.model("DailyRate", dailyReates);
