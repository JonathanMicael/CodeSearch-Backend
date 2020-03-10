const conexaoMongo = require("./conexaoMongo");
const interfaces = require("./interfaces");
const repositorios = require("./repositorios");
const passport = require("./passport");

module.exports = {
  conexaoMongo,
  interfaces,
  repositorios,
  passport
};
