const gravarUsuario = require("./gravarUsuario");
const gravarCodigo = require("./gravarCodigo");
const gravarArquivo = require("./gravarArquivo");

const favoritarCodigo = require("./favoritarCodigo");
const desfavoritarCodigo = require("./desfavoritarCodigo");

const logarUsuario = require("./logarUsuario");
const alterarArquivo = require("./alterarArquivo");

const apagarCodigo = require("./apagarCodigo");
const apagarArquivo = require("./apagarArquivo");
const apagarUsuario = require("./apagarUsuario");

module.exports = {
  gravarCodigo,
  gravarUsuario,
  gravarArquivo,
  apagarUsuario,
  apagarArquivo,
  apagarCodigo,
  logarUsuario,
  alterarArquivo,
  favoritarCodigo,
  desfavoritarCodigo
};
