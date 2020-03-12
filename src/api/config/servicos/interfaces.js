const { entradaComandos, entradaConsultas } = require("../../../interfaces");

const { gravarUsuario, incluirLogin } = require("../../../interfaces/comandos");
const {
  listarUsuarios,
  listarLogins,
  obterUsuario,
  obterLogin
} = require("../../../interfaces/consultas");
/**
 * @module {interfaces} - módulo para criar as interfaces do serviço - entradaComandos e entradaConsultas.
 * @param {Object} repositorios - objeto com os repositorios e consultas criados.
 * @returns {Oject} objeto com as interfaces criadas: {entradaComandos, entradaConsultas}.
 */
module.exports = repositorios => {
  const { repositorioUsuario, repositorioLogin } = repositorios.repositorios;
  const { consultaUsuario, consultaLogin } = repositorios.consultas;

  const _comandos = {
    gravarUsuario: gravarUsuario(repositorioUsuario),
    incluirLogin: incluirLogin(repositorioLogin)
  };

  const _consultas = {
    listarUsuarios: listarUsuarios(consultaUsuario),
    listarLogins: listarLogins(consultaLogin),
    obterUsuario: obterUsuario(repositorioUsuario),
    obterLogin: obterLogin(repositorioLogin)
  };

  const _entradaComandos = entradaComandos(_comandos);
  const _entradaConsultas = entradaConsultas(_consultas);

  return {
    entradaComandos: _entradaComandos,
    entradaConsultas: _entradaConsultas
  };
};
