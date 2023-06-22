const loginRoute = require("../utils/gen/miniApp")();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const { case_it } = require("../utils/gen/str");

const validateLogin = function (obj) {
  return Joi.object({
    username: Joi.string().min(3).max(20).trim().required(),
    password: Joi.string().min(8).max(1024).required(),
  }).validate(obj);
};

loginRoute.post("/", async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { username: u_name, password } = req.body;
  const exists = await User.findOne({ username: case_it(u_name) });
  if (!exists) return res.status(400).send("Invalid Username...");

  const v_password = await bcrypt.compare(password, exists.password);
  if (!v_password) return res.status(400).send("wrong password ...");

  res
    .set({
      ["access-control-expose-headers"]: "auth-key",
      ["auth-key"]: exists.getToken(),
    })
    .send("Signed in successfully...");
});

module.exports = loginRoute;
