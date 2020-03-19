const { codigo } = require('../../modelos');
const { processamento, retorno } = require('../../lib/util');

/**
 * @module {gravarCodigo} - comando para gravar um codigo.
 * @param {repositorioCodigo} repositorioCodigo - repositório do codigo.
 */
module.exports = (repositorioCodigo) => ({

	/**
	 * Executar o comando para gravar um codigo.
	 * @function {executar} - função obrigatório (interface) para todos os comandos.
	 * 
	 * @param {Object} parametro
	 * @param {string} parametro.autor - autor do codigo.
	 * @param {string} parametro.titulo - titulo do codigo.
	 * @param {string} parametro.descricao - descricao do codigo.
	 * @param {string} parametro.tecs - tecs do codigo.
	 * @param {string} parametro.conteudo [opcional] - conteudo do codigo.
   * 
	 * 
	 * @returns {Object}  {status: {codigo: number, mensagem: string}}.
	 */
	executar: async function (parametro) {

		const p = processamento(this.validarParametro, this.gerarCodigo, this.gravarCodigo);
		const r = await p(parametro);

		return retorno(r.status.codigo, r.status.mensagem)
	},

	/**
	 * Validar parâmetro
	 * @function {validarParametro}
	 * 
	 * @param {Object} parametro - parâmetro passado para execução do comando.
	 * 
	 * @returns {Object} {status: {codigo: number, mensagem: string}, ...parametro}.
	 */
	validarParametro: function (parametro) {
		if (!parametro || !parametro.autor || !parametro.titulo || !parametro.descricao || !parametro.tecs)
			return retorno(400, 'parâmetro inválido: { autor: string, titulo: string, descricao: string, tecs: [strings], id: string }');

		return retorno(200, 'parâmetro válido.', {}, { dadosCodigo: parametro });
	},

	/**
	 * Gerar objeto com dados do codigo formatado.
	 * @function {gerarCodigo}
	 * 
	 * @param {Object} dadosRetorno
	 * @param {Object} dadosRetorno.dadosCodigo - objeto com informações do codigo para gravar.
	 * 
	 * @returns {Object} {status: {codigo: number, mensagem: string}, ...dadosRetorno, codigo: Object}.
	 */
	gerarCodigo: function (dadosRetorno) {
		const dadosCodigo = codigo.criar(dadosRetorno.dadosCodigo);
		if (dadosCodigo.dados)
			return retorno(200, 'codigo gerado.', dadosRetorno, { codigo: dadosCodigo.dados });

		return retorno(400, 'os dados para gravar o codigo estão inconsistentes', dadosRetorno, {}, dadosCodigo.erros);
	},

	/**
	 * Persistir o codigo.
	 * @function {gravarCodigo}
	 * 
	 * @param {Object} dadosRetorno
	 * @param {Object} dadosRetorno.codigo - codigo gerado e validado para gravação.
	 * 
	 * @returns {Object} {status: {codigo: number, mensagem: string}, ...dadosRetorno}.
	 */
	gravarCodigo: async function (dadosRetorno) {
		if (dadosRetorno.status.codigo === 200) {
			const r = await repositorioCodigo.gravar(dadosRetorno.codigo);
			return retorno(r.status.codigo, r.status.mensagem, dadosRetorno);
		}
		return dadosRetorno;
	}

})