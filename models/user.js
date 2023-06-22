const { default: mongoose } = require("mongoose");
const { Sale, saleSchema } = require("./sale");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userJoiSchema = Joi.object({
  username: Joi.string().min(3).max(20).trim().required(),
  password: Joi.string().min(8).max(1024).required(),
  phone: Joi.string().min(10).max(20).required(),
});

function validateUser(obj) {
  return userJoiSchema.validate(obj);
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minLength: [3, "Username is too short"],
    maxLength: [20, "Username is too long"],
    trim: true,
    required: true,
  },
  password: {
    type: String,
    minLength: [8, "Password is too short"],
    maxLength: [1024, "Password is too long"],
    required: true,
  },
  phone: {
    type: String,
    minLength: [10, "Phone is too short"],
    maxLength: [20, "Phone is too long"],
    required: true,
    trim: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  profileImg: {
    type: String,
    maxLength: [1024, "Password is too long"],
  },
  sales: [saleSchema],
  registered: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.getToken = function () {
  return jwt.sign(
    { _id: this._id, phone: this.phone, isAdmin: this.isAdmin ,username:this.username},
    config.get("pass_key")
  );
};

const User = mongoose.model("User", userSchema);

exports.User = User;
exports.validateUser = validateUser;