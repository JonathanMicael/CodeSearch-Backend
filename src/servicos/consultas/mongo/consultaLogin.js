const { retorno } = require("../../../lib/util");

/**
 * @module {consultaLogin} - módulo para execução de consultas contra os logins.
 * @param {Object} conexao - conexao com o MongoDB.
 */
module.exports = conexao => ({
  /**
   * Listar os logins ordenados pela descrição.
   * @returns {object} retorna objeto com a lista dos logins: {status: {codigo: number, mensagem: string}, lista: Object[]}}.
   */
  listar: async function() {
    const a = await conexao
      .collection("Logins")
      .find({})
      .sort({ token: 1 })
      .toArray();
    if (a.length > 0) {
      const l = a.map(i => ({
        id: i.id,
        token: i.token
      }));

      return retorno(200, "lista de logins recuperada.", {}, { lista: l });
    }
    return retorno(404, "nenhum login cadastrado.");
  }
});
