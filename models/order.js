const mongoose = require("mongoose");

const orders = new mongoose.Schema(
  {
    user:  {type: mongoose.Schema.Types.ObjectId, ref: 'BranchUser'},
    remitNumber: {
      type: String,
      required: [true, "Remit Number is required"],
      maxlength: 255
    },
    sender: {
        type: String,
        required: [true, "Sender Name is required"],
        maxlength: 255
    },
    senderPhone: {
        type: String,
        required: [true, "Sender's Number is required"],
        maxlength: 255
    },
    senderAddress: {
      type: String,
      required: [true, "Sender's Address is required"],
      maxlength: 255, 
    },
    fromBranchId:{
        type: mongoose.Schema.Types.ObjectId,
        required:[true, "Branch Is Required"],
        ref: 'Branch'
    },
    beneficiary: {
        type: String,
        required: [true, "Beneficiary is required"],
        maxlength: 255
    },
    beneficiaryPhone: {
        type: String,
        required: [true, "Beneficiary Number is required"],
        maxlength: 255
    },
    beneficiaryCountry: {
        type: String,
        required: [true, "Beneficiary Country is required"],
        maxlength: 255
    },
    toBranchId:{
        type: mongoose.Schema.Types.ObjectId,
        required:[true, "Branch Is Required"],
        ref: 'Branch'

    },
    etbAmount: {
        type: String,
        required: [true, "ETB Amount is required"],
        maxlength: 255
    },
    etbComm: {
        type: String,
        required: false,
        maxlength: 255
    },
    etbTotal: {
        type: String,
        required: false,
        maxlength: 255
    },
    usdAmount: {
        type: String,
        required: false,
        maxlength: 255
    },
    usdComm: {
        type: String,
        required: false,
        maxlength: 255
    },
    usdTotal: {
        type: String,
        required: false,
        maxlength: 255
    },
    commPercentage: {
        type: String,
        required: false,
        maxlength: 255
    },
    exRate: {
        type: String,
        required: false,
        maxlength: 255
    },
    status: {
        type: String,
        enum : ['pending', 'ready', 'rejected' ],
        default: 'pending'
    },
    paidDate:{
        type:Date,
        required:false,
    },
    totalDays:{
        type:Number,
        required:false,
    },
    mode: {
        type: String,
        enum : ['cash', 'credit'],
    },
    remarks: {
        type: String,
        required: false,
        maxlength: 255
    },
  },
   {
    timestamps: true,
}
);

module.exports = mongoose.model("Order", orders);
