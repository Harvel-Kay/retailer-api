const filterApp = require("../utils/gen/miniApp")();
const { Product } = require("../models/product");
const { paginate } = require("../utils/gen/paginator");
const config = require("config");

const pageSize = config.get("page_size");

filterApp.get("/:current_p", async (req, res) => {
  // validate user login
  const { current_p } = req.params;
  const { query, genre_id, stock } = req.query;
  let total = 0;
  let products;

  //Calculating the count of documents depending on some route param criteria :)
  if (query && genre_id) {
    const name = new RegExp(query, "i");
    total = await Product.find()
      .or([{ name: { $regex: name } }, { "genre._id": genre_id }])
      .countDocuments();
  } else if (query) {
    const name = new RegExp(query, "i");
    total = await Product.find({ name: { $regex: name } }).countDocuments();
  } else if (genre_id)
    total = await Product.find({ "genre._id": genre_id }).countDocuments();
  else if (stock)
    total = await Product.find({ numberInStock: 0 }).countDocuments();
  else total = await Product.find().countDocuments();

  // Generating pagination utils :)
  const { startIndex, next, last_page } = paginate(current_p, total);

  // Retrieving the data now :)
  if (query && genre_id) {
    const name = new RegExp(query, "i");

    products = await Product.find()
      .or([{ name: { $regex: name } }, { "genre._id": genre_id }])
      .select(["-transactions", "-__v"])
      .skip(startIndex)
      .limit(pageSize);
    console.log("Both QS data are truthy ");
  } else if (query) {
    const name = new RegExp(query, "i");
    products = await Product.find({ name: { $regex: name } })
      .select(["-transactions", "-__v"])
      .skip(startIndex)
      .limit(pageSize);
  } else if (genre_id)
    products = await Product.find({ "genre._id": genre_id })
      .select(["-transactions", "-__v"])
      .skip(startIndex)
      .limit(pageSize);
  else if (stock)
    products = await Product.find({ numberInStock: 0 })
      .select(["-transactions", "-__v"])
      .skip(startIndex)
      .limit(pageSize);
  else
    products = await Product.find()
      .select(["-transactions", "-__v"])
      .skip(startIndex)
      .limit(pageSize);

  const response = {
    products: products || [],
    next,
    last_page,
  };
  res.send(response);
});

module.exports = filterApp;
