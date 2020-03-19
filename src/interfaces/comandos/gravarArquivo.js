const { arquivo } = require("../../modelos");
const { processamento, retorno } = require("../../lib/util");
const fs = require("fs");
const path = require("path");
/**
 * @module {gravarArquivo} - comando para gravar um arquivo.
 * @param {repositorioArquivo} repositorioArquivo - repositório do arquivo.
 */
module.exports = repositorioArquivo => ({
  /**
   * Executar o comando para gravar um arquivo.
   * @function {executar} - função obrigatório (interface) para todos os comandos.
   *
   * @param {Object} parametro
   * @param {string} parametro.id - [opcional] - id do arquivo.
   * @param {string} parametro.nome - nome do arquivo.
   * @param {string} parametro.tamanho - tamanho do arquivo.
   * @param {string} parametro.chave - chave do arquivo.
   * @param {string} parametro.url - url do arquivo.
   *
   *
   * @returns {Object}  {status: {codigo: number, mensagem: string}}.
   */
  executar: async function(parametro) {
    const p = processamento(
      this.validarParametro,
      this.gerarArquivo,
      this.gravarArquivo
    );
    const r = await p(parametro);

    return retorno(r.status.codigo, r.status.mensagem);
  },

  /**
   * Validar parâmetro
   * @function {validarParametro}
   *
   * @param {Object} parametro - parâmetro passado para execução do comando.
   *
   * @returns {Object} {status: {codigo: number, mensagem: string}, ...parametro}.
   */
  validarParametro: function(parametro) {
    if (
      !parametro ||
      !parametro.titulo ||
      !parametro.nome ||
      !parametro.tamanho ||
      !parametro.chave ||
      !parametro.url
    )
      return retorno(
        400,
        "parâmetro inválido: { titulo: string, nome: string, tamanho: string, chave: string, url: string, id: string }"
      );

    return retorno(200, "parâmetro válido.", {}, { dadosArquivo: parametro });
  },
  /**
   * Gerar objeto com dados do arquivo formatado.
   * @function {gerarArquivo}
   *
   * @param {Object} dadosRetorno
   * @param {Object} dadosRetorno.dadosArquivo - objeto com informações do arquivo para gravar.
   *
   * @returns {Object} {status: {codigo: number, mensagem: string}, ...dadosRetorno, arquivo: Object}.
   */
  gerarArquivo: function(dadosRetorno) {
    const dadosArquivo = arquivo.criar(dadosRetorno.dadosArquivo);
    if (dadosArquivo.dados)
      return retorno(200, "arquivo gerado.", dadosRetorno, {
        arquivo: dadosArquivo.dados
      });
    return retorno(
      400,
      "os dados para gravar o arquivo estão inconsistentes",
      dadosRetorno,
      {},
      dadosArquivo.erros
    );
  },

  /**
   * Persistir o arquivo.
   * @function {gravarArquivo}
   *
   * @param {Object} dadosRetorno
   * @param {Object} dadosRetorno.arquivo - arquivo gerado e validado para gravação.
   *
   * @returns {Object} {status: {codigo: number, mensagem: string}, ...dadosRetorno}.
   */
  gravarArquivo: async function(dadosRetorno) {
    if (dadosRetorno.status.codigo === 200) {
      const r = await repositorioArquivo.gravar(dadosRetorno.arquivo);
      return retorno(r.status.codigo, r.status.mensagem, dadosRetorno);
    }
    return dadosRetorno;
  }
});
