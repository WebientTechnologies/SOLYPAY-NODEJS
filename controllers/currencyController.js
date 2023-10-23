const { catchError } = require('../middleware/CatchError');
const Currency = require('../models/currency');
const ErrorHandler = require('../utils/ErrorHandler');

// Create a Currency
exports.createCurrency = catchError(async (req, res, next) => {
  const currencyData = req.body;
  const currency = new Currency({ ...currencyData });
  await currency.save();
  res.status(201).json({ message: 'Currency created successfully', currency });
});

// Get All Currencies
exports.getAllCurrencies = catchError(async (req, res, next) => {
  const currencies = await Currency.find();
  res.status(200).json({ currencies });
});

// Get Currency by ID
exports.getCurrencyById = catchError(async (req, res, next) => {
  const currency = await Currency.findById(req.params.id);
  if (!currency) {
    return next(new ErrorHandler('Currency not found', 404));
  }
  res.status(200).json({ currency });
});

// Update Currency by ID
exports.updateCurrencyById = catchError(async (req, res, next) => {
  const currencyData = req.body;
  const updatedCurrency = await Currency.findByIdAndUpdate(req.params.id, currencyData, { new: true });
  if (!updatedCurrency) {
    return next(new ErrorHandler('Currency not found', 404));
  }
  res.status(200).json({ message: 'Currency updated successfully', currency: updatedCurrency });
});

// Delete Currency by ID
exports.deleteCurrencyById = catchError(async (req, res, next) => {
  const currency = await Currency.findByIdAndDelete(req.params.id);
  if (!currency) {
    return next(new ErrorHandler('Currency not found', 404));
  }
  res.status(200).json({ success: true, message: 'Currency deleted successfully' });
});
