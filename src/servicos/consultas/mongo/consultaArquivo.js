const { retorno } = require("../../../lib/util");

/**
 * @module {consultaArquivo} - módulo para execução de consultas contra os arquivos.
 * @param {Object} conexao - conexao com o MongoDB.
 */
module.exports = conexao => ({
  /**
   * Listar os arquivos ordenados pelo nome.
   * @returns {object} retorna objeto com a lista dos arquivos: {status: {codigo: number, mensagem: string}, lista: Object[]}}.
   */
  listar: async function() {
    const a = await conexao.collection('Arquivos').find({}).sort({chave: 1}).toArray();
    if(a.length > 0) {
      const l = a.map(i => ({
        id: i.id,
        nome: i.nome,
        titulo: i.titulo,
        tamanho: i.tamanho,
        chave: i.chave,
        url: i.url,
      }))
      return retorno(200, "lista de arquivos recuperada.", {}, { lista: l });
    }
    return retorno(404, "nenhum arquivo cadastrado.");
  }
});
