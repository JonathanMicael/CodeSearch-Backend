const { processamento, retorno } = require("../../lib/util");

/**
 * @module {apagarCodigo} - comando para apagar um codigo.
 * @param {repositorioCodigo} repositorioCodigo - repositório de codigo.
 */
module.exports = repositorioCodigo => ({
  /**
   * Executar o comando para apagar um codigo.
   * @function {executar} - função obrigatório (interface) para todos os comandos.
   * @param {Object} parametro
   * @param {Object} parametro.id - id do codigo a ser buscado.
   * @returns {object} retorna mensagem de sucesso.
   */
  executar: async function(parametro) {
    const p = processamento(this.validarParametro, this.apagarCodigo);
    const r = await p(parametro);
    return retorno(r.status.codigo, r.status.mensagem, {}, { dados: r.codigo });
  },
  /**
   * Validar parâmetro
   * @function {validarParametro}
   * @param {Object} dados
   * @param {Object} dados.dadosCodigo - objeto com informações da configuração para obter.
   * @returns {Object} {status: {codigo: number, mensagem: string}, ...dados}.
   */
  validarParametro: function(parametro) {
    if (!parametro || typeof parametro.id === "undefined")
      return retorno(400, "parâmetro inválido: {id: string}");

    return retorno(
      200,
      "parâmetro válido.",
      {},
      { dadosCodigo: { id: parametro.id } }
    );
  },
  /**
   * Apagar o codigo.
   * @function {apagarCodigo}
   * @param {Object} dadosRetorno
   * @param {Object} dadosRetorno.dadosCodigo
   * @param {string} dadosRetorno.dadosCodigo.id - id do codigo.
   * @returns {Object} {status: {codigo: number, mensagem: string}, ...parametro, codigo: Object}.
   */
  apagarCodigo: async function(dadosRetorno) {
    if (dadosRetorno.status.codigo === 200) {
      const r = await repositorioCodigo.apagar(dadosRetorno.dadosCodigo);
      return retorno(r.status.codigo, r.status.mensagem);
    }
    return dadosRetorno;
  }
});
