const login = require("../middleware/auth");

const homeRouter = require("../utils/gen/miniApp")();

homeRouter.get("/", login, (req, res) => {
  console.log("Received request...");
  // res.send("Am the Retail HomePage");
  res.render("home.pug");
});

module.exports = homeRouter;
