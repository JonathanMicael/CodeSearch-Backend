const { retorno } = require("../../../lib/util");

/**
 * @module {consultaCodigo} - módulo para execução de consultas contra os codigos.
 * @param {Object} conexao - conexao com o MongoDB.
 */
module.exports = conexao => ({
  /**
   * Listar os codigos ordenados pelo titulo.
   * @returns {object} retorna objeto com a lista dos codigos: {status: {codigo: number, mensagem: string}, lista: Object[]}}.
   */
  listar: async function() {
    const a = await conexao.collection('Codigos').find({}).sort({titulo: 1}).toArray();
    if(a.length > 0) {
      const l = a.map(i => ({
        id: i.id,
        autor: i.autor,
        titulo: i.titulo,
        descricao: i.descricao,
        tecs: i.tecs,
        conteudo: i.conteudo,
      }))
      return retorno(200, "lista de codigos recuperada.", {}, { lista: l });
    }
    return retorno(404, "nenhum codigos cadastrado.");
  }
});
