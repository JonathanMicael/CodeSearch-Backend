const { processamento, retorno } = require('../../lib/util');

/**
 * @module {obterArquivo} - comando para obter arquivos.
 * @param {repositorioArquivo} repositorioArquivo - repositório do arquivo.
 */
module.exports = (repositorioArquivo) => ({

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
	executar: async function (parametro) {

		const p = processamento(this.validarParametro, this.obterArquivo);
		const r = await p(parametro);

		return retorno(r.status.codigo, r.status.mensagem, {}, { dados: r.codigo });
	},

	/**
	 * Validar parâmetro
	 * @function {validarParametro}
	 * 
	 * @param {Object} parametro - objeto com informações passadas para consultar arquivos.
	 * 
	 * @returns {Object} {status: {codigo: number, mensagem: string}, ...dados}.
	 */
	validarParametro: function (parametro) {
		if (!parametro || typeof parametro.titulo === 'undefined')
			return retorno(400, 'parâmetro inválido: {titulo: string}', parametro);

		return retorno (200, 'parâmetro válido.', parametro, {dadosArquivo: parametro});
	},

	/**
	 * Obter o arquivos.
	 * @function {obterArquivo}
	 * 
	 * @param {Object} dadosRetorno
	 * @param {Object} dadosRetorno.dadosArquivo
	 * @param {Object} dadosRetorno.dadosArquivo.id - id do arquivo.
	 * 
	 * @returns {Object} {status: {codigo: number, mensagem: string}, ...dados, retornoCodigo: Object}.
	 */
	obterArquivo: async function(dadosRetorno) {
		const r = await repositorioArquivo.obter(dadosRetorno.dadosArquivo);
		return retorno(r.status.codigo, r.status.mensagem, dadosRetorno, { arquivo: r.arquivo || {} });
	}

})