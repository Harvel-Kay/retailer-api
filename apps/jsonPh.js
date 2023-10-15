const { j_posts } = require("../jsonplaceholder");
const login = require("../middleware/auth");

const jsonApp = require("../utils/gen/miniApp")();

jsonApp.get("/posts", async (req, res) => {
  const posts = j_posts;
  res.send(posts);
});

module.exports = jsonApp;
