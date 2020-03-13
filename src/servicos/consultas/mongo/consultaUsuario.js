const { retorno } = require("../../../lib/util");

/**
 * @module {consultaUsuario} - módulo para execução de consultas contra os usuarios.
 * @param {Object} conexao - conexao com o MongoDB.
 */
module.exports = conexao => ({
  /**
   * Listar os usuarios ordenados pelo nome.
   * @returns {object} retorna objeto com a lista dos usuarios: {status: {codigo: number, mensagem: string}, lista: Object[]}}.
   */
  listar: async function() {
    const a = await conexao
      .collection("Usuarios")
      .find({})
      .sort({ nome: 1 })
      .toArray();
    if (a.length > 0) {
      const l = a.map(i => ({
        id: i.id,
        nome: i.nome,
        bio: i.bio,
        email: i.email,
        senha: i.senha
      }));

      return retorno(200, "lista de usuarios recuperada.", {}, { lista: l });
    }
    return retorno(404, "nenhum usuario cadastrado.");
  }
});
