const { criarCampo, imutavel, validacao } = require("../lib/util");
const { pipe, replace, trim } = require("ramda");

/**
 * @module {usuarioRepos} - módulo para gerenciar os repositorios de um usuario.
 */
module.exports = {
  /**
   * Criar uma novo repositorio para a usuario.
   * @function {criar}
   *
   * @param {Object} usuarioRepo
   * @param {string} usuarioRepo.autor - autor do repositorio.
   * @param {string} usuarioRepo.titulo - titulo do repositorio.
   * @param {string} usuarioRepo.descricao - descrição do repositorio.
   * @param {string} usuarioRepo.tecs - tecnologias do repositorio.
   * @param {string} usuarioRepo.conteudo - [Opicional] conteudo do repositorio.
   * @param {string} usuarioRepo.arquivos - [Opicional] arquivos do repositorio.
   * @param {string} usuarioRepo.comentarios - comentario do repositorio.
   *
   * @returns {Object} com dados da repositorios do usuario e array de erros de validação: {dados: Object, erros: string[]}.
   */
  criar: function(usuarioRepo) {
    if (!usuarioRepo)
      return {
        dados: null,
        erros: ["objeto repositorio do template inválido"]
      };

    const criarObjeto = template => {
      return [
        criarCampo("user_id", template.user_id, null, ""),
        criarCampo("autor", template.autor, trim, ""),
        criarCampo("titulo", template.titulo, trim, ""),
        criarCampo("descricao", template.descricao, trim, ""),
        criarCampo("tecs", template.tecs, null, []),
        criarCampo("conteudo", template.conteudo, trim, ""),
        criarCampo("arquivos", template.arquivos, null, []),
        criarCampo("comentarios", template.comentarios, null, [])
      ].reduce((ac, at) => (ac = { ...ac, ...at }), {});
    };

    const validarCampos = (usuarioRepo, erros) => {
      const d = usuarioRepo || {};
      return pipe(
        validacao.validarNome(
          d.autor,
          "autor do repositorio deve ter entre 2 e 250 caracteres e nem todos os especiais são aceitos",
          true
        ),
        validacao.validarNome(
          d.titulo,
          "titulo do repositorio deve ter entre 2 e 250 caracteres e nem todos os especiais são aceitos",
          true
        ),
        validacao.validarNome(
          d.descricao,
          "descrição do repositorio deve ter entre 2 e 250 caracteres e nem todos os especiais são aceitos",
          true
        ),
        validacao.validarArray(
          d.tecs,
          "as tecnologias deve ser do tipo array separado por virgulas"
        ),
        validacao.validarNome(
          d.conteudo,
          "conteudo do repositorio deve ter entre 2 e 250 caracteres e nem todos os especiais são aceitos",
          true
        ),
        validacao.validarArray(
          d.arquivos,
          "os repositorios deve ser do tipo array"
        ),
        validacao.validarArray(
          d.comentarios,
          "comentarios dos repositorio deve ser do tipo array"
        )
      )(erros);
    };

    const dados = criarObjeto(usuarioRepo);
    const erros = validarCampos(dados, []);

    return { dados: erros.length > 0 ? null : imutavel(dados), erros };
  },

  /**
   * Atualizar dados da usuarioRepo.
   * @param {Object} usuarioRepo - dados atual da usuarioRepo.
   */
  atualizar: function(usuarioRepo, valores) {
    return this.criar({ ...usuarioRepo, ...{ valores } });
  }
};
