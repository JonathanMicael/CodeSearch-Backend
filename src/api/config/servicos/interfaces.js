const { entradaComandos, entradaConsultas } = require("../../../interfaces");

const { gravarUsuario, gravarCodigo, gravarArquivo, apagarCodigo, apagarArquivo, alterarArquivo, logarUsuario } = require("../../../interfaces/comandos");
const {
  listarUsuarios,
  listarCodigos,
  listarArquivos,
  obterUsuario,
  obterCodigos,
  obterArquivos,
} = require("../../../interfaces/consultas");

/**
 * @module {interfaces} - módulo para criar as interfaces do serviço - entradaComandos e entradaConsultas.
 * @param {Object} repositorios - objeto com os repositorios e consultas criados.
 * @returns {Oject} objeto com as interfaces criadas: {entradaComandos, entradaConsultas}.
 */
module.exports = repositorios => {
  const { repositorioUsuario, repositorioCodigo,  repositorioArquivo} = repositorios.repositorios;
  const { consultaUsuario, consultaCodigo, consultaArquivo } = repositorios.consultas;

  const _comandos = {
    gravarUsuario: gravarUsuario(repositorioUsuario),
    gravarCodigo: gravarCodigo(repositorioCodigo),
    gravarArquivo: gravarArquivo(repositorioArquivo),
    logarUsuario: logarUsuario(repositorioUsuario),
    apagarCodigo: apagarCodigo(repositorioCodigo),
    apagarArquivo: apagarArquivo(repositorioArquivo),
    alterarArquivo: alterarArquivo(repositorioArquivo)
  };

  const _consultas = {
    listarUsuarios: listarUsuarios(consultaUsuario),
    listarCodigos: listarCodigos(consultaCodigo),
    listarArquivos: listarArquivos(consultaArquivo),
    obterUsuario: obterUsuario(repositorioUsuario),
    obterCodigos: obterCodigos(repositorioCodigo),
    obterArquivos: obterArquivos(repositorioArquivo),
  };

  const _entradaComandos = entradaComandos(_comandos);
  const _entradaConsultas = entradaConsultas(_consultas);

  return {
    entradaComandos: _entradaComandos,
    entradaConsultas: _entradaConsultas
  };
};
