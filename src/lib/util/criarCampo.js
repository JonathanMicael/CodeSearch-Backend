const { isEmpty } = require("ramda");

/**
 * Módulo para criação de campos nos objetos com formatação e valor padrão
 * @module {CriarCampo}
 * @param {string} idCampo - nome do campo.
 * @param {any} valorCampo - valor do campo.
 */
const criarCampo = (idCampo, valorCampo, funcaoFormatacao, valorPadrao) => ({
  [idCampo]:
    typeof valorCampo === "undefined" ||
    valorCampo === null ||
    isEmpty(valorCampo)
      ? valorPadrao
      : funcaoFormatacao
      ? funcaoFormatacao(valorCampo)
      : valorCampo
});

module.exports = criarCampo;
