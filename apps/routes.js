const express = require("express");
const helmet = require("helmet");
const error_handler = require("../middleware/error_handler");
const cors = require("cors");
const homeRouter = require("./home");
const userRoute = require("./users");
const loginRoute = require("./login");
const registerRoute = require("./register");
const genreRoute = require("./genre");
const productRoute = require("./product");
const saleRoute = require("./sales");
const tagRoute = require("./tags");

module.exports = function (app) {
  return (
    app.use(express.json({ limit: "50mb" })),
    app.use(express.urlencoded({ limit: "50mb", extended: true })),
    app.use(
      helmet({
        crossOriginResourcePolicy: false,
      })
    ),
    app.use(express.static("public")),
    app.use(cors()),
    app.use("/retail", homeRouter),
    app.use("/retail/users", userRoute),
    app.use("/retail/login", loginRoute),
    app.use("/retail/register", registerRoute),
    app.use("/retail/genres", genreRoute),
    app.use("/retail/products", productRoute),
    app.use("/retail/sales", saleRoute),
    app.use("/retail/tags", tagRoute),
    app.use(error_handler)
  );
};