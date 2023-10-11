const { default: mongoose } = require("mongoose");
const { Product, validateProduct } = require("../models/product");
const { case_it } = require("../utils/gen/str");
const { Genre } = require("../models/genre");
const productRoute = require("../utils/gen/miniApp")();
const fs = require("node:fs");
const config = require("config");
const login = require("../middleware/auth");
const { generateThumb } = require("../utils/gen/thumbnail");
const pageSize = 3;

productRoute.get("/:current_p", login, async (req, res) => {
  // validate user login
  const current_p = parseInt(req.params.current_p);
  const startIndex = (current_p - 1) * pageSize;

  const products = await Product.find()
    .select(["-transactions", "-__v"])
    .skip(startIndex)
    .limit(pageSize);
  const total = await Product.countDocuments();
  if (!products || !total)
    return res.status(500).send("oops try again,Appologies..... ");

  const last_page = Math.ceil(total / pageSize);

  let page = 1;
  if (last_page !== 1) page = current_p + 1;

  const response = {
    products,
    page,
    last_page,
  };
  res.send(response);
});

productRoute.get("/search/:name", async (req, res) => {
  const query = new RegExp(req.params.name, "i");

  const found = await Product.find({
    name: { $regex: query },
  }).limit(pageSize);

  if (!found)
    return res
      .status(500)
      .send("Oops there might be something wrong !, try again");

  res.send(found);
});

productRoute.post("/", login, async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, genre_id, price, tag, thumbnail, numberInStock } = req.body;

  const nameTaken = await Product.findOne({ name: case_it(name) });
  if (nameTaken) return res.status(400).send("Duplicate name...");

  if (!mongoose.isValidObjectId(genre_id))
    return res.status(400).send("invalid genre ");

  const isThere = await Genre.findById(genre_id);
  if (!isThere) return res.status(404).send("Genre doesn't exist");

  const newProduct = new Product({
    name: case_it(name),
    genre: isThere,
    price,
    numberInStock,
    tag,
    thumbnail,
  });

  await newProduct.save();
  res.send(newProduct);
});

productRoute.put("/:prod_id", login, async (req, res) => {
  // validate user permisions

  const { numberInStock, name, price } = req.body;
  const public_url = config.get("public_url");

  const exists = await Product.findById(req.params.prod_id);
  if (!exists) return res.status(404).send("Product doesn't exist");

  let tnail_p = "";
  if (!exists.thumbnail) {
    // Generate Thumbnail
    const file_path = exists.tag.replace(public_url, "public");
    const thumb_p = file_path.replace("tags", "thumbnails");
    tnail_p = generateThumb(file_path, thumb_p);
  }

  const updated = await Product.findOneAndUpdate(
    { _id: exists._id },
    { $set: { numberInStock, name, price, thumbnail: tnail_p } },
    { new: true }
  );

  res.send(updated);
});

productRoute.delete("/:prod_id", login, async (req, res) => {
  // validate user permissions....
  if (!mongoose.isValidObjectId(req.params.prod_id))
    return res.status(400).send("Invalid product");

  const exists = await Product.findById(req.params.prod_id);
  if (!exists) return res.status(404).send("Product doesn't exist");

  const deleted = await Product.findByIdAndDelete(req.params.prod_id);

  if (deleted.tag) {
    const tag_path = deleted.tag.replace(config.get("public_url"), "public/");
    fs.unlink(tag_path, (err) => {});
  }

  res.send(deleted);
});

module.exports = productRoute;
