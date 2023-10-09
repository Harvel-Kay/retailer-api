const config = require("config");
const fs = require("fs");
const sharp = require("sharp");

exports.generateThumb = function (file_p, thumb_p) {
  const public_url = config.get("public_url");
  fs.appendFile(thumb_p, "", "utf8", () => {});
  const tnail = sharp(file_p)
    .resize(320)
    .toFile(thumb_p)
    .then((data) => {})
    .catch((err) => tracker.error("Thumbnail Couldnt be generated...."));
  if (!tnail) throw new Error("Sorry ,Thumbnail...");
  return thumb_p.replace("public", public_url);
};
