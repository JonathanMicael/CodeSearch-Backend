const { entradaComandos, entradaConsultas } = require("../../../interfaces");

const { gravarUsuario, gravarCodigo,  incluirLogin, alterarArquivos } = require("../../../interfaces/comandos");
const {
  listarUsuarios,
  listarCodigos,
  listarLogins,
  obterUsuario,
  obterCodigos,
  obterLogin
} = require("../../../interfaces/consultas");
/**
 * @module {interfaces} - módulo para criar as interfaces do serviço - entradaComandos e entradaConsultas.
 * @param {Object} repositorios - objeto com os repositorios e consultas criados.
 * @returns {Oject} objeto com as interfaces criadas: {entradaComandos, entradaConsultas}.
 */
module.exports = repositorios => {
  const { repositorioUsuario, repositorioLogin, repositorioCodigo } = repositorios.repositorios;
  const { consultaUsuario, consultaLogin, consultaCodigo } = repositorios.consultas;

  const _comandos = {
    gravarUsuario: gravarUsuario(repositorioUsuario),
    gravarCodigo: gravarCodigo(repositorioCodigo),
    alterarArquivos: alterarArquivos(repositorioCodigo),
    incluirLogin: incluirLogin(repositorioLogin)
  };

  const _consultas = {
    listarUsuarios: listarUsuarios(consultaUsuario),
    listarCodigos: listarCodigos(consultaCodigo),
    listarLogins: listarLogins(consultaLogin),
    obterUsuario: obterUsuario(repositorioUsuario),
    obterCodigos: obterCodigos(repositorioCodigo),
    obterLogin: obterLogin(repositorioLogin)
  };

  const _entradaComandos = entradaComandos(_comandos);
  const _entradaConsultas = entradaConsultas(_consultas);

  return {
    entradaComandos: _entradaComandos,
    entradaConsultas: _entradaConsultas
  };
};
