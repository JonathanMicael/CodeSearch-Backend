const { processamento, retorno } = require("../../lib/util");

/**
 * @module {obterUsuario} - comando para obter um usuario.
 * @param {repositorioUsuario} repositorioUsuario - repositório do usuario.
 */
module.exports = repositorioUsuario => ({
  /**
   * Executar o comando para obter um usuario.
   * @function {executar} - função obrigatório (interface) para todos os comandos.
   *
   * @param {Object} parametro
   * @param {Object} parametro.id - id do usuario a ser buscado
   *
   * @returns {Object} retorna objeto com os dados do usuario: {status: {codigo: number, mensagem: string}, dados: Object}.
   */
  executar: async function(parametro) {
    const p = processamento(this.validarParametro, this.obterUsuario);
    const r = await p(parametro);

    return retorno(
      r.status.codigo,
      r.status.mensagem,
      {},
      { dados: r.usuario }
    );
  },

  /**
   * Validar parâmetro
   * @function {validarParametro}
   *
   * @param {Object} parametro - objeto com informações passadas para consultar usuario.
   *
   * @returns {Object} {status: {codigo: number, mensagem: string}, ...dados}.
   */
  validarParametro: function(parametro) {
    if (!parametro || typeof parametro.id === "undefined")
      return retorno(400, "parâmetro inválido: {id: string}", parametro);

    return retorno(200, "parâmetro válido.", parametro, {
      obterUsuario: { id: parametro.id }
    });
  },

  /**
   * Obter o usuario.
   * @function {obterUsuario}
   *
   * @param {Object} dadosRetorno
   * @param {Object} dadosRetorno.obterUsuario
   * @param {Object} dadosRetorno.obterUsuario.id - id do cliente.
   *
   * @returns {Object} {status: {codigo: number, mensagem: string}, ...dados, retornoUsuario: Object}.
   */
  obterUsuario: async function(dadosRetorno) {
    const r = await repositorioUsuario.obter(dadosRetorno.obterUsuario);
    return retorno(r.status.codigo, r.status.mensagem, dadosRetorno, {
      usuario: { ...r.usuario, senha: "" } || {}
    });
  }
});
