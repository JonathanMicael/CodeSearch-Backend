/**
 * Módulo para retorno padronizado pela API
 * @param {number} status - código do status de retorno.
 * @param {string} msg [opcional] - mensagem do retorno.
 * @param {Object} dados [opcional] - dados para retorno.
 * @returns {Object} objeto padronizado para retorno.
 */
module.exports = (status, msg = "", dados = {}) => ({
  statusCode: status,
  mensagem: msg,
  dados
});
