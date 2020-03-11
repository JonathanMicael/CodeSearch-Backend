const { repositorioUsuario } = require("../../../servicos/repositorios/mongo");
const { consultaUsuario } = require("../../../servicos/consultas/mongo");

/**
 * @module {repositorios} - módulo para criar todos os repositórios e consutlas usados no serviço.
 * @param {Object} conexao - objeto de conexão com o MongoDb obtido a partir do MongoClient.
 * @returns {Object} objeto com todos os repositórios e consultas configurados: {repositorios: Object, consutlas: Object}.
 */
module.exports = conexao => {
  // Injetando conexão mongo nos repositórios e consultas
  const _consultaUsuario = consultaUsuario(conexao);
  const _repositorioUsuario = repositorioUsuario(conexao);
  // Retornando um object literals com repositoios e consultas configurados
  return {
    repositorios: {
      repositorioUsuario: _repositorioUsuario
    },
    consultas: {
      consultaUsuario: _consultaUsuario
    }
  };
};
