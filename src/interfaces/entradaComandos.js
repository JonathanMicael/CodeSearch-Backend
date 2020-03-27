const { retorno } = require("../../src/lib/util");

/**
 * Gateway de entrada de comandos
 * @module {entradaComandos}
 *
 * @param {Object} comandos - comandos para execução.
 */
module.exports = comandos => ({
  /**
   * Procura o comando pelo idComando.
   * @function {obterComando}
   *
   * @param {string} idComando - identificação do comando.
   *
   * @returns {Object} objeto/interface comando para execução ou undefined se não encontrado.
   */
  obterComando: function(idComando) {
    return comandos[idComando];
  },

  /**
   * Executar comando solicitado.
   * @function {executar}
   *
   * @param {string} idComando - identificação do comando.
   * @param {Object} parametros - objeto com parâmetros para execução do comando.
   *
   * @returns {Object} objeto de retorno: {status: {codigo: number, mensagem: string} ...dados}.
   */
  executar: async function(idComando, parametros = {}) {
    const comando = this.obterComando(idComando);
    if (!comando) return retorno(400, `comando inválido: ${idComando}`);

    return await comando.executar(parametros);
  }
});
