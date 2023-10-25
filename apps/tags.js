const tagRoute = require("../utils/gen/miniApp")();
const path = require("path");
const multer = require("multer");
const tracker = require("../log/logger");
const config = require("config");
const _ = require("lodash");
const dir = "public/tags";
const { generateThumb } = require("../utils/gen/thumbnail");
const admin = require("../middleware/admin");

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

tagRoute.post("/", admin, upload.single("prod_tag"), async (req, res) => {
  // validate user
  const { file } = req;
  const public_url = config.get("public_url");
  const file_path = path.resolve(file.path);

  file.path = file.path.replace("public", public_url);

  // Thumbnail creation
  let thumb_p = `public/thumbnails/${file.originalname}`;
  const tnail_p = generateThumb(file_path, thumb_p);

  res.send({ path: file.path, thumbnail: tnail_p });
});

module.exports = tagRoute;
