const { processamento, retorno } = require("../../lib/util");

/**
 * @module {obterArquivo} - comando para obter arquivos.
 * @param {consultaArquivo} consultaArquivo - repositório do arquivo.
 */
module.exports = consultaArquivo => ({
  /**
   * Executar o comando para obter arquivos.
   * @function {executar} - função obrigatório (interface) para todos os comandos.
   *
   * @param {Object} parametro
   * @param {Object} parametro.id - id do arquivo a ser buscado
   * @param {Object} parametro.titulo - titulo do arquivo a ser buscado
   *
   * @returns {Object} retorna objeto com os dados do codigo: {status: {codigo: number, mensagem: string}, dados: Object}.
   */
  executar: async function(parametro) {
    const p = processamento(this.validarParametro, this.obterArquivo);
    const r = await p(parametro);

    return retorno(r.status.codigo, r.status.mensagem, {}, { dados: r.lista });
  },

  /**
   * Validar parâmetro
   * @function {validarParametro}
   *
   * @param {Object} parametro - objeto com informações passadas para consultar arquivos.
   *
   * @returns {Object} {status: {codigo: number, mensagem: string}, ...dados}.
   */
  validarParametro: function(parametro) {
    if (!parametro)
      return retorno(400, "parâmetro inválido: {id: string, titulo:string}", parametro);

    return retorno(200, "parâmetro válido.", parametro, {
      dadosArquivo: parametro
    });
  },

  /**
   * Obter o arquivos.
   * @function {obterArquivo}
   *
   * @param {Object} dadosRetorno
   * @param {Object} dadosRetorno.dadosArquivo
   * @param {Object} dadosRetorno.dadosArquivo.id - id do arquivo.
   * @param {Object} dadosRetorno.dadosArquivo.titulo - titulo do arquivo.
   *
   * @returns {Object} {status: {codigo: number, mensagem: string}, ...dados, retornoCodigo: Object}.
   */
  obterArquivo: async function(dadosRetorno) {
    const r = await consultaArquivo.listarPorTitulo(dadosRetorno.dadosArquivo);
    return retorno(r.status.codigo, r.status.mensagem, dadosRetorno, { lista: r.lista ? r.lista : [] });
  }
});
