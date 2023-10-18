const mongoose = require("mongoose");

const branches = new mongoose.Schema(
  {
    merchantAdmin:  {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    branch: {
      type: String,
      required: [true, "Branch is required"],
      minlength: [3, "Branch name should be at least 3 characters long"],
      maxlength: [255, "Branch name should not exceed 255 characters"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      minlength: [3, "Country name should be at least 3 characters long"],
      maxlength: [255, "Country name should not exceed 255 characters"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      minlength: [3, "City name should be at least 3 characters long"],
      maxlength: [255, "City name should not exceed 255 characters"],
    },
    address: {
        type: String,
        required: [false, "Address is not required"],
        minlength: [3, "Address name should be at least 3 characters long"],
        maxlength: [255, "Address name should not exceed 255 characters"],
      },
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [3, "Name should be at least 3 characters long"],
      maxlength: [255, "Name should not exceed 255 characters"],
    },
    email: {
      type: String,
      required: [false, "Email is not required"],
      maxlength: [255, "Email should not exceed 255 characters"],
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        "Invalid email format",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      maxlength: [20, "Phone number should not exceed 14 characters"],
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      minlength: [3, "Currency name should be at least 3 characters long"],
      maxlength: [255, "Currency name should not exceed 255 characters"],
    },
    timeZone: {
      type: String,
      required: [true, "Time zone is required"],
      minlength: [3, "Time zone name should be at least 3 characters long"],
      maxlength: [255, "Time zone name should not exceed 255 characters"],
    },
    creditLimit: {
      type: String,
      required: [true, "Credit limit is required"],
      minlength: [3, "Credit limit should be at least 3 characters long"],
      maxlength: [255, "Credit limit should not exceed 255 characters"],
    },
    remitLimit: {
      type: String,
      required: [true, "Remit limit is required"],
      minlength: [3, "Remit limit should be at least 3 characters long"],
      maxlength: [255, "Remit limit should not exceed 255 characters"],
    },
    payAgent: {
      type: String,
      required: [true, "Pay agent is required"],
      minlength: [3, "Pay agent should be at least 3 characters long"],
      maxlength: [255, "Pay agent should not exceed 255 characters"],
    },
    remitAgent: {
      type: String,
      required: [true, "Remit agent is required"],
      minlength: [3, "Remit agent should be at least 3 characters long"],
      maxlength: [255, "Remit agent should not exceed 255 characters"],
    },
    payCurrency: {
      type: String,
      required: [true, "Pay currency is required"],
      minlength: [3, "Pay currency should be at least 3 characters long"],
      maxlength: [255, "Pay currency should not exceed 255 characters"],
    },
    remitCurrency: {
      type: String,
      required: [true, "Remit currency is required"],
      minlength: [3, "Remit currency should be at least 3 characters long"],
      maxlength: [255, "Remit currency should not exceed 255 characters"],
    },
    balanceBy: {
      type: String,
      required: [false, "Balance by is not required"],
      minlength: [3, "Balance by should be at least 3 characters long"],
      maxlength: [255, "Balance by should not exceed 255 characters"],
    },
    remark: {
      type: String,
      required: [false, "Remark is not required"],
      minlength: [3, "Remark should be at least 3 characters long"],
      maxlength: [255, "Remark should not exceed 255 characters"],
    },
    info: {
      type: String,
      required: [false, "Info is not required"],
      minlength: [3, "Info should be at least 3 characters long"],
      maxlength: [2000, "Info should not exceed 2000 characters"],
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
   {
    timestamps: true,
}
);

module.exports = mongoose.model("Branch", branches);
