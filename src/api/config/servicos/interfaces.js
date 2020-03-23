const { entradaComandos, entradaConsultas } = require("../../../interfaces");

const { gravarUsuario, gravarCodigo, gravarArquivo, incluirLogin, apagarCodigo, apagarArquivo, alterarArquivo } = require("../../../interfaces/comandos");
const {
  listarUsuarios,
  listarCodigos,
  listarArquivos,
  listarLogins,
  obterUsuario,
  obterCodigos,
  obterArquivos,
  obterLogin
} = require("../../../interfaces/consultas");

/**
 * @module {interfaces} - módulo para criar as interfaces do serviço - entradaComandos e entradaConsultas.
 * @param {Object} repositorios - objeto com os repositorios e consultas criados.
 * @returns {Oject} objeto com as interfaces criadas: {entradaComandos, entradaConsultas}.
 */
module.exports = repositorios => {
  const { repositorioUsuario, repositorioLogin, repositorioCodigo,  repositorioArquivo} = repositorios.repositorios;
  const { consultaUsuario, consultaLogin, consultaCodigo, consultaArquivo } = repositorios.consultas;

  const _comandos = {
    gravarUsuario: gravarUsuario(repositorioUsuario),
    gravarCodigo: gravarCodigo(repositorioCodigo),
    gravarArquivo: gravarArquivo(repositorioArquivo),
    // incluirLogin: incluirLogin(repositorioLogin),
    apagarCodigo: apagarCodigo(repositorioCodigo),
    apagarArquivo: apagarArquivo(repositorioArquivo),
    alterarArquivo: alterarArquivo(repositorioArquivo)
  };

  const _consultas = {
    listarUsuarios: listarUsuarios(consultaUsuario),
    listarCodigos: listarCodigos(consultaCodigo),
    listarArquivos: listarArquivos(consultaArquivo),
    // listarLogins: listarLogins(consultaArquivo),
    obterUsuario: obterUsuario(repositorioUsuario),
    obterCodigos: obterCodigos(repositorioCodigo),
    obterArquivos: obterArquivos(repositorioArquivo),
    obterLogin: obterLogin(repositorioLogin)
  };

  const _entradaComandos = entradaComandos(_comandos);
  const _entradaConsultas = entradaConsultas(_consultas);

  return {
    entradaComandos: _entradaComandos,
    entradaConsultas: _entradaConsultas
  };
};
