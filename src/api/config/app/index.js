const autenticacao = require('./autenticacao');
const middlewares = require("./middlewares");
const multerConfig = require("./multerConfig");
const rotas = require("./routes");

module.exports = {
  autenticacao,
  middlewares,
  multerConfig,
  rotas
};
