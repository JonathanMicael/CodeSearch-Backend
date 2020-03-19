const gravarUsuario = require("./gravarUsuario");
const gravarCodigo = require("./gravarCodigo");
const gravarArquivo = require("./gravarArquivo");

const incluirLogin = require("./incluirLogin");
const alterarArquivo = require("./alterarArquivo");

const apagarCodigo = require("./apagarCodigo");
const apagarArquivo = require("./apagarArquivo");


module.exports = {
  gravarCodigo,
  gravarUsuario,
  gravarArquivo,
  apagarArquivo,
  apagarCodigo,
  incluirLogin,
  alterarArquivo,
};
