const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const multer = require('multer');
const uuid = require('uuid/v4')
const path = require('path')

const storage = multer.diskStorage({
  destination: path.resolve(__dirname, '..', '..','..', 'uploads'),
  filename: (req, file, cb, filename) => {
      cb(null, uuid() + path.extname(file.originalname));
  }
});


/**
 * Módulo para inserir os middlewares no app express.
 * @param {express} app - app express.
 * @returns {express} app com middlewares injetados.
 */
module.exports = app => {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(passport.initialize());
  app.use(multer({storage}).array('arquivos'));

  return app;
};
