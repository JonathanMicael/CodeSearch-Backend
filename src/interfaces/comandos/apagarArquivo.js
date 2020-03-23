const { processamento, retorno } = require('../../lib/util');
const path = require('path');
const fs = require('fs');
/**
 * @module {apagarArquivo} - comando para apagar um arquivo.
 * @param {repositorioArquivo} repositorioArquivo - repositório de arquivo.
 */
module.exports = (repositorioArquivo) => ({
	/**
	 * Executar o comando para apagar um arquivo.
	 * @function {executar} - função obrigatório (interface) para todos os comandos.
	 * @param {Object} parametro
	 * @param {Object} parametro.id - id do arquivo a ser buscado.
	 * @returns {object} retorna mensagem de sucesso.
	 */
	executar: async function (parametro) {
		const p = processamento(this.validarParametro, this.verificaArquivo, this.apagarArquivo);
		const r = await p(parametro);
		return retorno(r.status.codigo, r.status.mensagem, {}, { dados: r.arquivo });
	},
	/**
	 * Validar parâmetro
	 * @function {validarParametro} 
	 * @param {Object} dados
	 * @param {Object} dados.dadosArquivo - objeto com informações da configuração para obter.
	 * @returns {Object} {status: {codigo: number, mensagem: string}, ...dados}.
	 */
	validarParametro: function (parametro) {
		if (!parametro || typeof parametro.id === 'undefined')
			return retorno(400, 'parâmetro inválido: {id: string}')

		return retorno(200, 'parâmetro válido.', {}, { dadosArquivo: { id: parametro.id } });
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
		const r = await repositorioArquivo.obterPorId(dadosRetorno.dadosArquivo);
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
	 * Apagar o arquivo.
	 * @function {apagarArquivo}
	 * @param {Object} dadosRetorno
	 * @param {Object} dadosRetorno.dadosArquivo
	 * @param {string} dadosRetorno.dadosArquivo.id - id do arquivo.
	 * @returns {Object} {status: {codigo: number, mensagem: string}, ...parametro, arquivo: Object}.
	 */
	apagarArquivo: async function (dadosRetorno) {
		if (dadosRetorno.status.codigo === 200) {
			const r = await repositorioArquivo.apagar(dadosRetorno.dadosArquivo);
			return retorno(r.status.codigo, r.status.mensagem);
		}
		return dadosRetorno;
	}
})