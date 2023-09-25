const tagRoute = require("../utils/gen/miniApp")();
const path = require("path");
const multer = require("multer");
const tracker = require("../log/logger");
const config = require("config");
const _ = require("lodash");
const login = require("../middleware/auth");
const dir = "public/tags";

const storage = multer.diskStorage({
  destination: dir,
  filename: function (req, file, cb) {
    try {
      cb(null, file.originalname);
    } catch (err) {
      tracker.error(err.message, err);
    }
  },
});

const upload = multer({ storage });

tagRoute.post("/", login, upload.single("prod_tag"), async (req, res) => {
  // validate user
  const { file } = req;
  const file_path = path.resolve(file.path);
  const tag_path = file_path.replace(
    path.resolve("public"),
    config.get("public_url")
  );
  file.path = tag_path;

  // console.log("File saved => ", file);
  res.send(_.pick(file, ["path", "filename"]));
});

module.exports = tagRoute;
