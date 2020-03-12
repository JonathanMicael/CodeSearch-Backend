const { retorno } = require("../../lib/util");

/**
 * @module {listarLogins} - consulta para listar logins cadastrados.
 * @param {consultaLogin} consultaLogin - serviço de consulta aos logins.
 */
module.exports = consultaLogin => ({
  /**
   * Executar a consulta.
   * @function {executar} - função obrigatório (interface) para todos as consultas.
   *
   * @returns {object} retorna objeto com a lista dos logins: {status: {codigo: number, mensagem: string}, dados: Object[]}.
   */
  executar: async function() {
    const r = await this.listarLogins();
    return retorno(r.status.codigo, r.status.mensagem, {}, { dados: r.lista });
  },

  /**
   * Listar os logins.
   *
   * @function {listarLogins}
   *
   * @returns {Object} {status: {codigo: number, mensagem: string}, lista: Object[]}.
   */
  listarLogins: async function() {
    const r = await consultaLogin.listar();
    return retorno(
      r.status.codigo,
      r.status.mensagem,
      {},
      { lista: r.lista ? r.lista : [] }
    );
  }
});
