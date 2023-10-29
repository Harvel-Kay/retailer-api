const { default: mongoose } = require("mongoose");
const { Product, validateProduct } = require("../models/product");
const { case_it } = require("../utils/gen/str");
const { Genre } = require("../models/genre");
const productRoute = require("../utils/gen/miniApp")();
const fs = require("node:fs");
const config = require("config");
const { generateThumb } = require("../utils/gen/thumbnail");
const admin = require("../middleware/admin");

productRoute.post("/", admin, async (req, res) => {
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

productRoute.put("/:prod_id", admin, async (req, res) => {
  // validate user permisions

  const { numberInStock, name, price } = req.body;
  const public_url = config.get("public_url");

  const exists = await Product.findById(req.params.prod_id);
  if (!exists) return res.status(404).send("Product doesn't exist");

  let tnail_p = exists.thumbnail;
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

productRoute.delete("/:prod_id", admin, async (req, res) => {
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
