const { retorno } = require("../../src/lib/util");

/**
 * Gateway de entrada de consultas
 * @module {entradaConsultas}
 * @param {Object} consultas - as consultas para execução.
 */
module.exports = consultas => ({
  /**
   * Procura a consulta pelo idConsulta.
   * @function {obterConsulta}
   *
   * @param {string} idConsulta - identificação do consulta.
   *
   * @returns {Object} objeto/interface consulta para execução ou undefined se não encontrado.
   */
  obterConsulta: function(idConsulta) {
    return consultas[idConsulta];
  },

  /**
   * Executar consulta solicitado.
   * @function {executar}
   *
   * @param {string} idConsulta - identificação do consulta.
   * @param {Object} parametros - objeto com parâmetros para execução do consulta.
   *
   * @returns {Object} objeto de retorno: {status: {codigo: number, mensagem: string} ...dados}.
   */
  executar: async function(idConsulta, parametros = {}) {
    const consulta = this.obterConsulta(idConsulta);
    if (!consulta) return retorno(400, `consulta inválida: ${idConsulta}`);

    return await consulta.executar(parametros);
  }
});
