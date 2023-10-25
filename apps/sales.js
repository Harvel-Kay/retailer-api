const login = require("../middleware/auth");
const { Product } = require("../models/product");
const { validateSales, Sale } = require("../models/sale");
const { User } = require("../models/user");
const Joi = require("joi");
const validDate = require("../utils/date");
const admin = require("../middleware/admin");

const saleRoute = require("../utils/gen/miniApp")();

saleRoute.get("/", async (req, res) => {
  const sales = await Sale.find();
  res.send(sales);
});

saleRoute.post("/", async (req, res) => {
  // validate user
  const { error } = validateSales(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { user_id, products } = req.body;

  const db_user = await User.findOne({ _id: user_id });
  if (!db_user) return res.status(400).send("Invalid user ...");

  products.forEach(async (prod) => {
    const product = await Product.findById(prod._id);
    if (!product) return res.status(400).send("Invalid product...");
    if (product.numberInStock === 0)
      return res.status(400).send("Order out of Stock...");
  });

  const newSale = new Sale({
    user: { _id: db_user._id, username: db_user.username },
    products,
  });
  await newSale.save();
  const sale_id = newSale._id;

  const saved = await Sale.findById({ _id: sale_id });
  if (saved) {
    saved.products.forEach(async (prod) => {
      const updated = await Product.findOneAndUpdate(
        { _id: prod._id },
        {
          $push: { transactions: sale_id },
          $inc: { numberInStock: -prod.qty },
        },
        { new: true }
      );
      if (!updated) await Sale.findByIdAndDelete(sale_id);
    });
  }
  res.send(saved);
});

module.exports = saleRoute;
