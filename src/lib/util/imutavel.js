/**
 * Módulo para tornar objetos imutáveis.
 * @module {Imutavel}
 * @param {object} obj - objeto para tornar imutável.
 */
const imutavel = (obj) => {
	Object.keys(obj).forEach(function congelarObjetosAninhados(nome) {
		const valor = obj[nome];
		if (typeof valor === "object" && valor != null) {
			imutavel(valor);
		}
	});
	return Object.freeze(obj);
}

module.exports = imutavel;