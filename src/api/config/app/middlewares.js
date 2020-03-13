const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const uuid = require("uuid/v4");
const path = require("path");

const storage = multer.diskStorage({
  destination: path.resolve(__dirname, "..", "..", "..", "uploads"),
  filename: (req, file, cb, filename) => {
    cb(null, uuid() + path.extname(file.originalname));
  }
});

/**
 * Módulo para inserir os middlewares no app express.SS
 * @param {express} app - app express.
 * @returns {express} app com middlewares injetados.
 */
module.exports = app => {
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"]
    })
  );
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(multer({ storage }).array("arquivos"));

  return app;
};
