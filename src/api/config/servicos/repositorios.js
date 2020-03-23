const {
  repositorioUsuario,
  repositorioArquivo,
  repositorioCodigo,
  repositorioLogin
} = require("../../../servicos/repositorios/mongo");
const {
  consultaUsuario,
  consultaArquivo,
  consultaCodigo,
  consultaLogin
} = require("../../../servicos/consultas/mongo");

/**
 * @module {repositorios} - módulo para criar todos os repositórios e consutlas usados no serviço.
 * @param {Object} conexao - objeto de conexão com o MongoDb obtido a partir do MongoClient.
 * @returns {Object} objeto com todos os repositórios e consultas configurados: {repositorios: Object, consutlas: Object}.
 */
module.exports = conexao => {
  // Injetando conexão mongo nos repositórios e consultas
  const _consultaUsuario = consultaUsuario(conexao);
  const _consultaCodigo = consultaCodigo(conexao);
  const _consultaArquivo = consultaArquivo(conexao);
  const _consultaLogin = consultaLogin(conexao);
  const _repositorioUsuario = repositorioUsuario(conexao);
  const _repositorioCodigo = repositorioCodigo(conexao);
  const _repositorioArquivo = repositorioArquivo(conexao);
  const _repositorioLogin = repositorioLogin(conexao);
  // Retornando um object literals com repositoios e consultas configurados
  return {
    repositorios: {
      repositorioUsuario: _repositorioUsuario,
      repositorioCodigo: _repositorioCodigo,
      repositorioArquivo: _repositorioArquivo,
      repositorioLogin: _repositorioLogin
    },
    consultas: {
      consultaUsuario: _consultaUsuario,
      consultaCodigo: _consultaCodigo,
      consultaArquivo: _consultaArquivo,
      consultaLogin: _consultaLogin
    }
  };
};
