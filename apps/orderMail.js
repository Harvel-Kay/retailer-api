const orderMailApp = require("../utils/gen/miniApp")();
const nodemailer = require("nodemailer");
const config = require("config");
const pug = require("pug");

orderMailApp.post("/", async (req, res) => {
  // send a mail to the admin

  const compiled = pug.compileFile("views/order.pug");
  const { name, phone, products } = req.body;
  const mail_account = config.get("mail_account");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: mail_account,
      pass: config.get("mail_pass"),
    },
  });

  const options = {
    from: mail_account,
    to: "kayharvel5@gmail.com",
    subject: "Items Purchase",
    html: compiled({ name, phone, products }),
  };

  let error;
  transporter
    .sendMail(options)
    .then((data) => (error = false))
    .catch((err) => (error = true));
  //   console.log("Response =>", response);

  if (error)
    return res
      .status(500)
      .send("Order wasn't submitted , Please try again....");
  res.send(
    "Order placed successfully, Please call on the provided number for confirmation and more details"
  );
});

module.exports = orderMailApp;
