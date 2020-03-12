const { processamento, retorno } = require("../../lib/util");

/**
 * @module {obterLogin} - consulta para obter um login.
 * @param {repositorioLogin} repositorioLogin - repositório do login.
 */
module.exports = repositorioLogin => ({
  /**
   * Executar a consulta para obter um login.
   * @function {executar} - função obrigatório (interface) para todas as consultas.
   *
   * @param {Object} parametro
   * @param {Object} parametro.id - id do login a ser buscado.
   *
   * @returns {Object} retorna objeto com os dados do login: {status: {codigo: number, mensagem: string}, dados: Object}.
   */
  executar: async function(parametro) {
    const p = processamento(this.validarParametro, this.obterLogin);
    const r = await p(parametro);

    return retorno(r.status.codigo, r.status.mensagem, {}, { dados: r.login });
  },

  /**
   * Validar parâmetro
   * @function {validarParametro}
   *
   * @param {Object} parametro - objeto com informações passadas para consultar o login.
   *
   * @returns {Object} {status: {codigo: number, mensagem: string}, ...dados}.
   */
  validarParametro: function(parametro) {
    if (!parametro || typeof parametro.id === "undefined")
      return retorno(400, "parâmetro inválido: {id: string}", parametro);

    return retorno(200, "parâmetro válido.", parametro, {
      dadosLogin: { id: parametro.id }
    });
  },

  /**
   * Obter o login.
   * @function {obterLogin}
   *
   * @param {Object} dadosRetorno
   * @param {Object} dadosRetorno.dadosLogin
   * @param {Object} dadosRetorno.dadosLogin.id - id do login.
   *
   * @returns {Object} {status: {codigo: number, mensagem: string}, ...dados, login: Object}.
   */
  obterLogin: async function(dadosRetorno) {
    const r = await repositorioLogin.obter(dadosRetorno.dadosLogin);
    return retorno(r.status.codigo, r.status.mensagem, dadosRetorno, {
      login: r.login || {}
    });
  }
});
