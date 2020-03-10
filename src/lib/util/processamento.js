/**
 * Módulo para execução de um pipe de forma assíncrona
 * @module {Processamento}
 * 
 * @param {...function} fns - funções para serem executadas no pipe.
 * @param {object} parametroInicial - objeto com dados iniciais para execução do pipe.
 * @returns {object} objeto final após execução do pipe.
 */
module.exports = (...fns) => parametroInicial => {

	/**
	 * Normalizar parâmetro de execução no pipe.
	 * @param {object} parametro - parâmetro para normalização
	 * @returns {object} parâmetro normalizado.
	 */
	const normalizarParametro = parametro => {
		let p = parametro || {};

		if (p.status === undefined) {
			p = { ...p, status: { codigo: 200, mensagem: '' } };
		}
		if (p.status.codigo === undefined) {
			p = { ...p, status: { codigo: 200, ...p.status } }
		}
		if (p.status.mensagem === undefined) {
			p = { ...p, status: { mensagem: '', ...p.status } }
		}

		return p;
	}
	
    return fns.reduce(async (ac, f) => {
		const p = normalizarParametro(await ac);
		
		if (![200, 201].includes(p.status.codigo))
			return p;

		return f(p)
	}, parametroInicial);
};

/*
const composePromises = (...ms) => (
	ms.reduce((f, g) => x => g(x).then(f))
);
*/