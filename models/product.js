const Joi = require("joi");
const { default: mongoose } = require("mongoose");
const { genreSchema } = require("./genre");

const validateProduct = function (obj) {
  return Joi.object({
    name: Joi.string().min(3).max(20).trim().required(),
    genre_id: Joi.objectid(),
    tag: Joi.string().max(1024),
    thumbnail: Joi.string().max(1024),
    price: Joi.number().min(0).required(),
    numberInStock: Joi.number().min(0).integer().required(),
  }).validate(obj);
};

const prodSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, "Name is too short"],
    maxLength: [20, "Name is too long"],
    trim: true,
    required: true,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  price: {
    type: Number,
    min: 0,
    required: true,
    required: true,
  },
  numberInStock: {
    type: Number,
    min: 0,
    required: true,
    required: true,
  },
  tag: {
    type: String,
    maxLength: [1024, "Tag Name is too long"],
    trim: true,
    default: "",
  },
  thumbnail:{
    type: String,
    maxLength: [1024, "Thumb Name is too long"],
    trim: true,
    default: "",
  },
  transactions: [mongoose.SchemaTypes.ObjectId],
  added: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", prodSchema);

// exports.prodSchema = prodSchema;
exports.validateProduct = validateProduct;
exports.Product = Product;
