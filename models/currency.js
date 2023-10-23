const mongoose = require('mongoose');

const currencySchema = new mongoose.Schema({
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    trim: true, // This ensures leading/trailing white spaces are removed
  },
  symbol: {
    type: String,
    required: [true, 'Symbol is required'],
    trim: true, // This ensures leading/trailing white spaces are removed
  },
  shortName: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

const CurrencyModel = mongoose.model('Currency', currencySchema);

module.exports = CurrencyModel;
