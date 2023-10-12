const filterApp = require("../utils/gen/miniApp")();
const { Product } = require("../models/product");
const login = require("../middleware/auth");

filterApp.get("/search/:name", login, async (req, res) => {
  const { name } = req.params;
  const query = new RegExp(name, "i");

  const products = await Product.find({
    name: { $regex: query },
  });

  if (!products)
    return res
      .status(500)
      .send("Oops there might be something wrong !, try again");

  res.send(products);
});

filterApp.get("/genre/:genre_id", login, async (req, res) => {
  const { genre_id } = req.params;
  const products = await Product.find({ "genre._id": genre_id }).select([
    "-transactions",
    "-__v",
  ]);

  if (!products) return res.status(500).send("oops try again,Appologies..... ");

  res.send(products);
});

filterApp.get("/out-of-stock", login, async (req, res) => {
  const products = await Product.find({ numberInStock: 0 }).select([
    "-transactions",
    "-__v",
  ]);
  if (!products) return res.status(500).send("oops try again,Appologies..... ");

  res.send(products);
});

module.exports = filterApp;
