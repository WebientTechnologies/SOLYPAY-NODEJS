const Branch = require("../models/branch");
const { catchError } = require("../middleware/CatchError");
const CountryCity = require("../models/countryCity");
const ErrorHandler = require("../utils/ErrorHandler");

exports.createBranch = catchError(async (req, res, next) => {
  const branch = new Branch({ ...req.body, merchantAdmin: req.user._id });
  await branch.save();
  const loc = await CountryCity.find({ country: req.body.country, city: req.body.city });

  if (loc.length === 0) {
    const newLoc = new CountryCity({
      merchantAdmin: req.user._id,
      country: req.body.country,
      city: req.body.city
    });
    await newLoc.save();
  }
  res.status(201).json({ message: "Branch created successfully", branch });
});

exports.getAllBranches = catchError(async (req, res, next) => {
    const { name, country } = req.query;
    const query = { merchantAdmin: req.user._id };
  
    if (name) {
      query.name = { $regex: new RegExp(name, "i") }; // Case-insensitive name search
    }
  
    if (country) {
      query.country = { $regex: new RegExp(country, "i") }; // Case-insensitive country search
    }
  
    const branches = await Branch.find(query);
    res.status(200).json({ branches });
  });
  

exports.getBranchById = catchError(async (req, res, next) => {
  const branch = await Branch.findById(req.params.id);
  if (!branch) {
    return next(new ErrorHandler("Branch not found", 404));
  }
  if (branch.merchantAdmin.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Unauthorized. This branch does not belong to you.", 403));
  }
  res.status(200).json({ branch });
});

exports.updateBranchById = catchError(async (req, res, next) => {
  const branch = await Branch.findById(req.params.id);
  if (!branch) {
    return next(new ErrorHandler("Branch not found", 404));
  }
  if (branch.merchantAdmin.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Unauthorized. You cannot update a branch that doesn't belong to you.", 403));
  }
  const updatedBranch = await Branch.findByIdAndUpdate(req.params.id, { ...req.body,  merchantAdmin: req.user._id}, { new: true });
  res.status(200).json({ message: "Branch updated successfully", branch: updatedBranch });
});

exports.deleteBranchById = catchError(async (req, res, next) => {
    const branch = await Branch.findOne({ _id: req.params.id });
  
    if (!branch) {
      return next(new ErrorHandler("Branch not found", 404));
    }
  
    if (branch.merchantAdmin.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("Unauthorized. You cannot delete a branch that doesn't belong to you.", 403));
    }
  
    await branch.deleteOne(); 
  
    res.status(200).json({ success: true, message: "Branch deleted successfully" });
  });
  