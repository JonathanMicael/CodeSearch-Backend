const { retorno } = require("../../lib/util");

/**
 * @module {listarUsuarios} - consulta para listar usuarios cadastrados.
 * @param {consultaCliente} consultaCliente - serviço de consulta aos usuarios.
 */
module.exports = consultaCliente => ({
  /**
   * Executar a consulta.
   * @function {executar} - função obrigatório (interface) para todos as consultas.
   *
   * @returns {object} retorna objeto com a lista dos usuarios: {status: {codigo: number, mensagem: string}, dados: Object[]}.
   */
  executar: async function() {
    const r = await this.listarUsuarios();
    return retorno(r.status.codigo, r.status.mensagem, {}, { dados: r.lista });
  },

  /**
   * Listar os usuarios.
   * @function {listarUsuarios}
   *
   * @param {Object} dados
   *
   * @returns {Object} {status: {codigo: number, mensagem: string}, lista: Object[]}.
   */
  listarUsuarios: async function() {
    const r = await consultaCliente.listar();
    return retorno(
      r.status.codigo,
      r.status.mensagem,
      {},
      { lista: r.lista ? r.lista : [] }
    );
  }
});
