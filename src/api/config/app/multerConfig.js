const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, "..", "..", "..", "tmp", "uploads"));
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);

        file.key = `${hash.toString("hex")}-${file.originalname}`;

        cb(null, file.key);
      });
    }
  })
};

module.exports = {
  dest: path.resolve(__dirname, "..", "..", "..", "tmp", "uploads"),
  storage: storageTypes["local"],
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.*$/)) {
      return cb(new Error("Only image files are allowed!"), false);
    } else {
      cb(null, true);
    }
  }
};
