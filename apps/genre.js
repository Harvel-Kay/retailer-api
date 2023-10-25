const { default: mongoose } = require("mongoose");
const { Genre, validateGenre } = require("../models/genre");
const { case_it } = require("../utils/gen/str");
const login = require("../middleware/auth");
const admin = require("../middleware/admin");

const genreRoute = require("../utils/gen/miniApp")();

genreRoute.get("/", async (req, res) => {
  const genres = await Genre.find();
  res.send(genres);
});

genreRoute.post("/", admin, async (req, res) => {
  const payload = { ...req.body };
  const { error } = validateGenre(payload);
  if (error) return res.status(400).send(error.details[0].message);

  const nameTaken = await Genre.findOne({ name: case_it(req.body.name) });
  if (nameTaken) return res.status(400).send("Duplicate name...");

  const newGenre = new Genre(payload);
  newGenre.name = case_it(newGenre.name);
  await newGenre.save();

  res.send(newGenre);
});

genreRoute.put("/:genre_id", admin, async (req, res) => {
  // authenticate user
  const payload = { ...req.body };
  const genre_id = req.params.genre_id;
  const { error } = validateGenre(payload);
  if (error) return res.status(400).send(error.details[0].message);

  if (!mongoose.isValidObjectId(genre_id))
    return res.status(400).send("Invalid data ....");

  const isThere = await Genre.findById(genre_id);
  if (!isThere) return res.status(404).send("Genre doesn't exist ....");

  if (isThere.name === case_it(payload.name))
    return res.status(400).send("Duplicate name... !");

  payload.name = case_it(payload.name);
  const updated = await Genre.findOneAndUpdate({ _id: genre_id }, payload, {
    new: true,
  });
  res.send(updated);
});

genreRoute.delete("/:genre_id", admin, async (req, res) => {
  const genre_id = req.params.genre_id;
  // validate user permisions & authenticate
  if (!mongoose.isValidObjectId(genre_id))
    return res.status(400).send("Invalid data ....");

  const isThere = await Genre.findById(genre_id);
  if (!isThere) return res.status(404).send("Genre doesn't exist ....");

  const deleted = await Genre.findByIdAndDelete(genre_id);
  res.send(deleted);
});

module.exports = genreRoute;
