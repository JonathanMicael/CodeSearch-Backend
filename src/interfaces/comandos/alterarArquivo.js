const { processamento, retorno } = require("../../lib/util");
const path = require('path');
const fs = require('fs');
/**
 * @module {alterarArquivo} - comando para alterar um arquivo de configuração.
 * @param {repositorioArquivo} repositorioArquivo - repositório de arquivo.
 */
module.exports = repositorioArquivo => ({
  /**
   * Executar o comando para alterar um arquivo.
   * @function {executar} - função obrigatório (interface) para todos os comandos.
   *
   * @param {Object} parametro
   * @param {string} parametro.id - uuid do arquivo.
   * @param {string} parametro.nome - nome do arquivo.
   * @param {string} parametro.tamanho - tamanho do arquivo.
   * @param {string} parametro.chave - chave do arquivo.
   * @param {string} parametro.url - url do arquivo.
   *
   * @returns {Object} {status: {codigo: number, mensagem: string}}.
   */
  executar: async function(parametro) {
    const processarComando = processamento(
      this.validarParametro,
      this.verificaArquivo,
      this.alterarArquivo
    );
    const r = await processarComando(parametro);

    return retorno(r.status.codigo, r.status.mensagem);
  },

  /**
   * Validar parâmetro
   * @function {validarParametro}
   *
   * @param {Object} parametro - parâmetro passado para execução do comando.
   *
   * @returns {Object} {status: {codigo: number, mensagem: string}, dadosArquivo: Object}.
   */
  validarParametro: function(parametro) {
    if (
      !parametro ||
      !parametro.titulo ||
      !parametro.id ||
      !parametro.nome ||
      !parametro.tamanho ||
      !parametro.chave ||
      !parametro.url
    )
      return retorno(
        400,
        "parâmetro inválido: {id: string, nome: string, tamanho: string, chave: string, url: string}"
      );

    return retorno(200, "parâmetro válido.", {}, { dadosArquivo: parametro });
  },
 /**
   * Verifica o arquivos locais com dados do arquivo.
   * @function {verificaArquivo}
   *
   * @param {Object} dadosRetorno
   * @param {Object} dadosRetorno.dadosArquivo - objeto com informações do arquivo para verficar .
   *
   * @returns {Object} {status: {codigo: number, mensagem: string}, ...dadosRetorno, arquivo: Object}.
   */
  verificaArquivo: async function(dadosRetorno) {
    const r = await repositorioArquivo.obter(dadosRetorno.dadosArquivo);
    try {
      if (r.status.codigo === 200) {
        fs.unlinkSync(path.resolve(__dirname,"..","..","tmp","uploads", r.arquivo.chave));
				return retorno(200, "arquivo apagado", dadosRetorno);
			} else {
        return retorno(
          404,
          "os arquivos nao exitem",
          dadosRetorno,
        );
      }
    } catch (error) {
			return retorno(
				500,
				"erro interno no servidor",
				dadosRetorno,
			);
		}
  },
  /**
   * Alterar um arquivo.
   * @function {alterarArquivo}
   *
   * @param {Object} dadosRetorno
   * @param {Object} dadosRetorno.dadosArquivo - dados do arquivo para alteração.
   *
   * @returns {Object} {status: {codigo: number, mensagem: string}, ...dadosRetorno}.
   */
  alterarArquivo: async function(dadosRetorno) {
    if (dadosRetorno.status.codigo === 200) {
      const r = await repositorioArquivo.alterarArquivo(dadosRetorno.dadosArquivo);
      return retorno(r.status.codigo, r.status.mensagem);
    }
    return dadosRetorno;
  }
});
