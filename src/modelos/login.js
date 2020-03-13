const uuid = require("uuid/v4");
const { criarCampo, imutavel, validacao } = require("../lib/util");
const { compose, pipe } = require("ramda");

/**
 * @module {login} - módulo para gerenciar a entidade login.
 */
module.exports = {
  /**
   * Criar um novo login.
   *
   * @param {Object} login - objeto com dados do login.
   * @param {string} login.user_id - id do login.
   * @param {string} login.token - token do login.
   *
   * @returns {Object} com dados do login gerado e array de erros: {dados: object, erros: string[]}
   */
  criar: function(login) {
    if (!login) return { dados: null, erros: ["objeto login inválido"] };

    const criarObjeto = login => {
      return [
        criarCampo("id", login.id, null, uuid(), ""),
        criarCampo("token", login.token, null, "")
      ].reduce((ac, at) => (ac = { ...ac, ...at }), {});
    };

    const validarLogin = login => {
      const dados = login || {};
      const validar = pipe(
        validacao.validarUUID(
          dados.id,
          "id do login no formato UUID V4 inválido",
          true
        ),
        validacao.validarTamanhoMinimo(
          dados.token,
          12,
          "tamanho mínimo do token: 12"
        )
      );

      return { dados: login, erros: validar([]) };
    };

    const criarLogin = pipe(criarObjeto, validarLogin);
    const retorno = criarLogin(login);

    return {
      dados: retorno.erros.length > 0 ? null : imutavel(retorno.dados),
      erros: retorno.erros
    };
  }
};
