const { retorno } = require("../../lib/util");

/**
 * @module {listarArquivos} - consulta para listar arquivos cadastrados.
 * @param {consultaArquivo} consultaArquivo - serviço de consulta aos arquivos.
 */
module.exports = consultaArquivo => ({
  /**
   * Executar a consulta.
   * @function {executar} - função obrigatório (interface) para todos as consultas.
   *
   * @returns {object} retorna objeto com a lista dos arquivos: {status: {codigo: number, mensagem: string}, dados: Object[]}.
   */
  executar: async function() {
    const r = await this.listarArquivos();
    return retorno(r.status.codigo, r.status.mensagem, {}, { dados: r.lista });
  },

  /**
   * Listar os arquivos.
   * @function {listarArquivos}
   *
   * @param {Object} dados
   *
   * @returns {Object} {status: {codigo: number, mensagem: string}, lista: Object[]}.
   */
  listarArquivos: async function() {
    const r = await consultaArquivo.listar();
    return retorno(
      r.status.codigo,
      r.status.mensagem,
      {},
      { lista: r.lista ? r.lista : [] }
    );
  }
});
