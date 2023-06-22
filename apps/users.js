const { default: mongoose } = require("mongoose");
const { User } = require("../models/user");
const Joi = require("joi");
const _ = require("lodash");
const login = require("../middleware/auth");

const userRoute = require("../utils/gen/miniApp")();

userRoute.get("/", login, async (req, res) => {
  // validate permissions
  const users = await User.find().select(["-__v", "-password"]);
  res.send(users);
});

userRoute.get("/user", login, async (req, res) => {
  const err_msg = validateUserModify(req.body);
  if (err_msg) return res.status(400).send(err_msg);

  const { user_id } = req.body;
  if (!mongoose.isValidObjectId(user_id))
    return res.status(400).send("Invalid User...");

  const user = await User.findById(user_id);
  if (!user) return res.status(404).send("User doesn't exist...");

  res.send(_.pick(user, ["_id", "username", ""]));
});

userRoute.delete("/:user_id", login, async (req, res) => {
  const user_id = req.params.user_id;
  if (!mongoose.isValidObjectId(user_id))
    return res.status(400).send("Invalid User...");

  const user = await User.findByIdAndDelete(user_id);
  if (!user) return res.status(404).send("User doesn't exist...");

  res.send(_.pick(user, ["_id", "username", ""]));
});

module.exports = userRoute;

function validateUserModify(obj) {
  const { error } = Joi.object({
    user_id: Joi.objectid(),
  }).validate(obj);
  return error ? error.details[0].message : false;
}