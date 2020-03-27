const { processamento, retorno } = require("../../lib/util");

/**
 * @module {obterCodigo} - comando para obter codigos.
 * @param {repositorioCodigo} repositorioCodigo - repositório do codigo.
 */
module.exports = repositorioCodigo => ({
  /**
   * Executar o comando para obter codigos.
   * @function {executar} - função obrigatório (interface) para todos os comandos.
   *
   * @param {Object} parametro
   * @param {Object} parametro.titulo - titulo do codigo a ser buscado
   *
   * @returns {Object} retorna objeto com os dados do codigo: {status: {codigo: number, mensagem: string}, dados: Object}.
   */
  executar: async function(parametro) {
    const p = processamento(this.validarParametro, this.obterCodigo);
    const r = await p(parametro);

    return retorno(r.status.codigo, r.status.mensagem, {}, { dados: r.codigo });
  },

  /**
   * Validar parâmetro
   * @function {validarParametro}
   *
   * @param {Object} parametro - objeto com informações passadas para consultar codigos.
   *
   * @returns {Object} {status: {codigo: number, mensagem: string}, ...dados}.
   */
  validarParametro: function(parametro) {
    if (!parametro || typeof parametro.id === "undefined")
      return retorno(400, "parâmetro inválido: {id: string}", parametro);

    return retorno(200, "parâmetro válido.", parametro, {
      dadosCodigos: { id: parametro.id }
    });
  },

  /**
   * Obter o codigos.
   * @function {obterCodigo}
   *
   * @param {Object} dadosRetorno
   * @param {Object} dadosRetorno.dadosCodigos
   * @param {Object} dadosRetorno.dadosCodigos.id - id dos codigos.
   *
   * @returns {Object} {status: {codigo: number, mensagem: string}, ...dados, retornoCodigo: Object}.
   */
  obterCodigo: async function(dadosRetorno) {
    const r = await repositorioCodigo.obter(dadosRetorno.dadosCodigos);
    return retorno(r.status.codigo, r.status.mensagem, dadosRetorno, {
      codigo: r.codigo || {}
    });
  }
});
