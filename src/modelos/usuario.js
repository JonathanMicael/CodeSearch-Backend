const uuid = require("uuid/v4");
const bcrypt = require("bcrypt");
const { criarCampo, imutavel, validacao } = require("../lib/util");
const { compose, pipe, replace, toUpper, trim } = require("ramda");
const salt = bcrypt.genSaltSync(10);
/**
 * @module {usuario} - módulo para gerenciar a entidade usuario.
 */
module.exports = {
  /**
   * Criar um novo usuario
   * @param {Object} dadosUsuario
   * @param {string} dadosCliente.id [opcional]- id do cliente.
   * @param {string} dadosUsuario.nome - nome do cliente.
   * @param {string} dadosUsuario.identificacao - identificacao do cliente.
   * @param {string} dadosUsuario.email - CNPJ ou CPF do cliente.
   * @param {string} dadosUsuario.senha - cidade do cliente.
   * @returns {object} com dados do usuario gerado e array de erros: {dados: object, erros: string[]}
   */
  criar: function(dadosUsuario) {
    if (!dadosUsuario) return { dados: null, erros: ["dadosUsuario inválido"] };
    const criarObjeto = dadosUsuario => {
      return [
        criarCampo("id", dadosUsuario.id, null, uuid(), ""),
        criarCampo("nome", dadosUsuario.nome, compose(trim), ""),
        criarCampo(
          "identificacao",
          dadosUsuario.identificacao,
          compose(trim),
          ""
        ),
        criarCampo("email", dadosUsuario.email, compose(trim), ""),
        criarCampo("senha", dadosUsuario.senha, compose(trim), "")
      ].reduce((ac, at) => (ac = { ...ac, ...at }), {});
    };

    const validarCampos = (dadosUsuario, erros) => {
      const d = dadosUsuario || {};

      return pipe(
        validacao.validarUUID(
          d.id,
          "id do cliente no formato UUID V4 inválido",
          true
        ),
        validacao.validarNome(
          d.nome,
          "nome do cliente deve ter entre 2 e 250 caracteres e nem todos os especiais são aceitos",
          true
        ),
        validacao.validarIdentificacao(
          d.identificacao,
          "identificação do cliente deve ter entre 2 e 20 caracteres",
          true
        ),
        validacao.validarSenha(
          d.senha,
          "senha do cliente deve ter entre no minimo 8 caracteres e nem todos os especiais são aceitos",
          true
        ),
        validacao.validarNome(
          d.cidade,
          "cidade do cliente deve ter entre 2 e 250 caracteres e nem todos os especiais são aceitos",
          true
        )
      )(erros);
    };

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
