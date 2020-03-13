const { retorno } = require("../../lib/util");

/**
 * @module {listarCodigos} - consulta para listar codigos cadastrados.
 * @param {consultaCodigo} consultaCodigo - serviço de consulta aos codigos.
 */
module.exports = consultaCodigo => ({
  /**
   * Executar a consulta.
   * @function {executar} - função obrigatório (interface) para todos as consultas.
   *
   * @returns {object} retorna objeto com a lista dos codigos: {status: {codigo: number, mensagem: string}, dados: Object[]}.
   */
  executar: async function() {
    const r = await this.listarCodigos();
    return retorno(r.status.codigo, r.status.mensagem, {}, { dados: r.lista });
  },

  /**
   * Listar os codigos.
   * @function {listarCodigos}
   *
   * @param {Object} dados
   *
   * @returns {Object} {status: {codigo: number, mensagem: string}, lista: Object[]}.
   */
  listarCodigos: async function() {
    const r = await consultaCodigo.listar();
    return retorno(
      r.status.codigo,
      r.status.mensagem,
      {},
      { lista: r.lista ? r.lista : [] }
    );
  }
});
