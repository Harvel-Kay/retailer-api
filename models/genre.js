const Joi = require("joi");
const { default: mongoose } = require("mongoose");

const validateGenre = function (obj) {
  return Joi.object({
    name: Joi.string().min(3).max(20).trim().required(),
  }).validate(obj);
};

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, "Genre name too short"],
    maxLength: [20, "Genre name too long"],
    required: true,
    trim: true,
  },
});

const Genre = mongoose.model("Genre", genreSchema);

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validateGenre = validateGenre;
