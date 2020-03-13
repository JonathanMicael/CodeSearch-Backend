const { processamento, retorno } = require('../../lib/util');

/**
 * @module {alterarArquivos} - comando para alterar arquivos de codigo.
 * @param {repositorioCodigo} repositorioCodigo- repositório de codigo.
 */
module.exports = (repositorioCodigo) => ({

	/**
	 * Executar o comando para alterar um codigo.
	 * @function {executar} - função obrigatório (interface) para todos os comandos.
	 * 
	 * @param {Object} parametro
	 * @param {string} parametro.titulo - titulo do codigo.
	 * @param {string} parametro.arquivos - novos arquivos do codigo.
	 * 
	 * @returns {Object} {status: {codigo: number, mensagem: string}}.
	 */
	executar: async function (parametro) {

		const processarComando = processamento(this.validarParametro, this.alterarArquivos);
		const r = await processarComando(parametro);

		return retorno(r.status.codigo, r.status.mensagem)
	},

	/**
	 * Validar parâmetro
	 * @function {validarParametro}
	 * 
	 * @param {Object} parametro - parâmetro passado para execução do comando.
	 * 
	 * @returns {Object} {status: {codigo: number, mensagem: string}, dadosArquivo: Object}.
	 */
	validarParametro: function (parametro) {
		if (!parametro || !parametro.titulo || !Array.isArray(parametro.arquivos))
			return retorno(400, 'parâmetro inválido: {titulo: string, arquivos: string}');

		return retorno (200, 'parâmetro válido.', {}, {dadosArquivo: parametro});
	},

	/**
	 * Alterar um codigo.
	 * @function {alterarArquivos}
	 * 
	 * @param {Object} dadosRetorno
	 * @param {Object} dadosRetorno.dadosArquivo - dados do codigo para alteração.
	 * 
	 * @returns {Object} {status: {codigo: number, mensagem: string}, ...dadosRetorno}.
	 */
	alterarArquivos: async function(dadosRetorno) {
		if (dadosRetorno.status.codigo === 200) {
			const r = await repositorioCodigo.alterarArquivos(dadosRetorno.dadosArquivo);
			return retorno(r.status.codigo, r.status.mensagem);
		}
		return dadosRetorno;
	}

})