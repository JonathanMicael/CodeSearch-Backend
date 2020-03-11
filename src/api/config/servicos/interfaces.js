const { entradaComandos, entradaConsultas } = require("../../../interfaces");

const { gravarUsuario } = require("../../../interfaces/comandos");
const {
  listarUsuarios,
  obterUsuario
} = require("../../../interfaces/consultas");
/**
 * @module {interfaces} - módulo para criar as interfaces do serviço - entradaComandos e entradaConsultas.
 * @param {Object} repositorios - objeto com os repositorios e consultas criados.
 * @returns {Oject} objeto com as interfaces criadas: {entradaComandos, entradaConsultas}.
 */
module.exports = repositorios => {
  const { repositorioUsuario } = repositorios.repositorios;
  const { consultaUsuario } = repositorios.consultas;

  const _comandos = {
    gravarUsuario: gravarUsuario(repositorioUsuario)
  };

  const _consultas = {
    listarUsuarios: listarUsuarios(consultaUsuario),
    obterUsuario: obterUsuario(repositorioUsuario)
  };

  const _entradaComandos = entradaComandos(_comandos);
  const _entradaConsultas = entradaConsultas(_consultas);

  return {
    entradaComandos: _entradaComandos,
    entradaConsultas: _entradaConsultas
  };
};
