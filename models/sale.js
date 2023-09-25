const { default: mongoose } = require("mongoose");
const Joi = require("joi");

const validateSales = function (obj) {
  return Joi.object({
    user_id: Joi.objectid(),
    products: Joi.array().required(),
  }).validate(obj);
};

const cartProdSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, "Name is too short"],
    maxLength: [20, "Name is too long"],
    trim: true,
    required: true,
  },

  qty: {
    type: Number,
    min: 0,
    required: true,
    required: true,
  },

  price: {
    type: Number,
    min: 0,
    required: true,
    required: true,
  },
  
});

const saleSchema = new mongoose.Schema({
  user: {
    type: new mongoose.Schema({
      _id: { type: mongoose.SchemaTypes.ObjectId, required: true },
      username: {
        type: String,
        minLength: [3, "Username is too short"],
        maxLength: [20, "Username is too long"],
        trim: true,
        lowerCase: true,
        required: true,
      },
    }),
    required: true,
  },
  products: {
    type: [cartProdSchema],
    required: true,
  },
  dateSold: {
    type: Date,
    default: Date.now,
  },
});

const Sale = mongoose.model("Sale", saleSchema);

exports.saleSchema = saleSchema;
exports.Sale = Sale;
exports.validateSales = validateSales;
