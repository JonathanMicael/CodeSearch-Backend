const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");

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
  return app;
};
