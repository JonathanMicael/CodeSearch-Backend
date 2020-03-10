const { retorno } = require("../../lib/util");

/**
 * @module {listarClientes} - consulta para listar clientes cadastrados.
 * @param {consultaCliente} consultaCliente - serviço de consulta aos clientes.
 */
module.exports = consultaCliente => ({
  /**
   * Executar a consulta.
   * @function {executar} - função obrigatório (interface) para todos as consultas.
   *
   * @returns {object} retorna objeto com a lista dos clientes: {status: {codigo: number, mensagem: string}, dados: Object[]}.
   */
  executar: async function() {
    const r = await this.listarClientes();
    return retorno(r.status.codigo, r.status.mensagem, {}, { dados: r.lista });
  },

  /**
   * Listar os clientes.
   * @function {listarClientes}
   *
   * @param {Object} dados
   *
   * @returns {Object} {status: {codigo: number, mensagem: string}, lista: Object[]}.
   */
  listarClientes: async function() {
    const r = await consultaCliente.listar();
    console.log(r);
    return retorno(
      r.status.codigo,
      r.status.mensagem,
      {},
      { lista: r.lista ? r.lista : [] }
    );
  }
});
