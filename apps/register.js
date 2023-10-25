const registerRoute = require("../utils/gen/miniApp")();
const { validateUser, User } = require("../models/user");
const { case_it } = require("../utils/gen/str");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { validNumber, thereErrors } = require("../utils/gen/validators");

registerRoute.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { username: u_name, confirm, password, phone } = req.body;
  const nameTaken = await User.findOne({ username: case_it(u_name) });
  const phoneTaken = await User.findOne({ phone: { $eq: phone } });

  if (nameTaken) return res.status(400).send("Username is taken");
  if (password !== confirm)
    return res.status(400).send("Passwords didnt match");
  if (phoneTaken) return res.status(400).send("Phone is taken");

  const error_2 = validNumber({ name: "phone", value: phone }, {});
  if (thereErrors(error_2))
    return res.status(400).send(`Phone : ${error_2.phone}`);

  const salt = await bcrypt.genSalt(10);

  const newbie = new User(_.pick(req.body, ["username", "password", "phone"]));
  newbie.username = case_it(u_name);
  newbie.password = await bcrypt.hash(newbie.password, salt);
  await newbie.save();

  res
    .set({
      ["access-control-expose-headers"]: "auth-key",
      ["auth-key"]: newbie.getToken(),
    })
    .send("Registered successfully ....");
});

module.exports = registerRoute;
