const uuid = require("uuid/v4");
const bcrypt = require("bcrypt");
const { criarCampo, imutavel, validacao } = require("../lib/util");
const { compose, pipe, replace, toLower, trim } = require("ramda");

const salt = bcrypt.genSaltSync(10);
/**
 * @module {usuario} - módulo para gerenciar a entidade usuario.
 */
module.exports = {
  /**
   * Criar um novo usuario
   * @param {Object} dadosUsuario
   * @param {string} dadosUsuario.id [opcional]- id do usuario.
   * @param {string} dadosUsuario.nome - nome do usuario.
   * @param {string} dadosUsuario.bio - bio do usuario.
   * @param {string} dadosUsuario.email - email do usuario.
   * @param {string} dadosUsuario.senha - senha do usuario.
   * @param {string} dadosUsuario.role - role do usuario.
   * @returns {object} com dados do usuario gerado e array de erros: {dados: object, erros: string[]}
   */
  criar: function(dadosUsuario) {
    if (!dadosUsuario) return { dados: null, erros: ["dadosUsuario inválido"] };
    const criarObjeto = dadosUsuario => {
      return [
        criarCampo("id", dadosUsuario.id, null, uuid(), ""),
        criarCampo("nome", dadosUsuario.nome, compose(trim), ""),
        criarCampo("bio", dadosUsuario.bio, null, ""),
        criarCampo("email", dadosUsuario.email, compose(trim, toLower), ""),
        criarCampo("senha", dadosUsuario.senha, compose(trim), ""),
        criarCampo("permissoes", null, null, ["usuario"])
      ].reduce((ac, at) => (ac = { ...ac, ...at }), {});
    };

    const validarCampos = dadosUsuario => {
      const dados = dadosUsuario || {};

      const validarDados = dados => erros => {
        const validar = pipe(
          validacao.validarUUID(
            dados.id,
            "id do usuario no formato UUID V4 inválido",
            true
          ),
          validacao.validarNome(
            dados.nome,
            "nome do usuario deve ter entre 2 e 250 caracteres e nem todos os especiais são aceitos",
            true
          ),
          validacao.validarNome(
            dados.bio,
            "Bio do usuario deve ter entre 2 e 20 caracteres",
            false
          ),
          validacao.validarEmail(
            dados.email,
            "o email do usuario deve ter entre 2 e 250 caracteres e nem todos os especiais são aceitos e pertencer a compasso",
            true
          ),
          validacao.validarSenha(
            dados.senha,
            "senha do usuario deve ter entre no minimo 8 caracteres e nem todos os especiais são aceitos",
            true
          )
        );
        return validar(erros);
      };

      const formatarSenha = dados => erros => {
        if (!dados || erros.length > 0) return dados;

        const dadosFormatado = {
          ...dados,
          senha: bcrypt.hashSync(dados.senha, salt)
        };

        return { dados: dadosFormatado, erros };
      };

      const validar = pipe(validarDados(dados), formatarSenha(dados));
      const erros = validar([]);

      return dados, erros;
    };

    // Criando oficialmente o objeto de configuração
    const dados = criarObjeto(dadosUsuario);
    const erros = validarCampos(dados, []);

    return { dados: erros.length > 0 ? null : imutavel(dados), erros };
  },

  /**
   * Atualizar dados do usuario.
   * @function {atualizar}
   *
   * @param {Object} usuario - dados atual do usuario.
   * @param {string} nome - nome do usuario.
   * @param {string} usuario - nome do usuario.
   * @param {string} email - email do usuario.
   * @param {string} senha - senha do usuario.
   *
   * @returns {object} com dados do usuario gerado e array de erros: {dados: object, erros: string[]}
   */
  atualizar: function(usuario, resto) {
    return this.criar({ ...usuario, ...resto });
  }
};
