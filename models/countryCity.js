const mongoose = require("mongoose");

const countryCity = new mongoose.Schema(
  {
    merchantAdmin:  {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    country: {
        type: String,
        required: [true, "Beneficiary Country is required"],
        maxlength: 255
    },
    city: {
        type: String,
        required: [true, "Beneficiary City is required"],
        maxlength: 255
    },
  },
   {
    timestamps: true,
}
);

module.exports = mongoose.model("CountryCity", countryCity);
