const { usuario } = require("../../modelos");
const { processamento, retorno } = require("../../lib/util");

/**
 * @module {gravarUsuario} - comando para gravar um Usuario.
 * @param {repositorioUsuario} repositorioUsuario - repositório do Usuario.
 */
module.exports = repositorioUsuario => ({
  /**
   * Executar o comando para gravar um usuario.
   * @function {executar} - função obrigatório (interface) para todos os comandos.
   *
   * @param {Object} parametro
   * @param {string} parametro.nome - nome do usuario.
   * @param {string} parametro.identificacao - identificação do usuario.
   * @param {string} parametro.email - email do usuario.
   * @param {string} parametro.senha - senha do usuario.
   *
   * @returns {Object}  {status: {codigo: number, mensagem: string}}.
   */
  executar: async function(parametro) {
    const p = processamento(
      this.validarParametro,
      this.gerarUsuario,
      this.gravarUsuario
    );
    const r = await p(parametro);

    return retorno(r.status.codigo, r.status.mensagem);
  },

  /**
   * Validar parâmetro
   * @function {validarParametro}
   *
   * @param {Object} parametro - parâmetro passado para execução do comando.
   *
   * @returns {Object} {status: {codigo: number, mensagem: string}, ...parametro}.
   */
  validarParametro: function(parametro) {
    if (
      !parametro ||
      !parametro.nome ||
      !parametro.email ||
      !parametro.senha
      )
      return retorno(
        400,
        "parâmetro inválido: {nome: string, email: string, senha: string}"
      );

    return retorno(200, "parâmetro válido.", {}, { dadosUsuario: parametro });
  },
  /**
   * Gerar objeto com dados do usuario formatado.
   * @function {gerarUsuario}
   *
   * @param {Object} dadosRetorno
   * @param {Object} dadosRetorno.dadosUsuario- objeto com informações do usuario para gravar.
   *
   * @returns {Object} {status: {codigo: number, mensagem: string}, ...dadosRetorno, usuario: Object}.
   */
  gerarUsuario: function(dadosRetorno) {
    const dadosUsuario = usuario.criar(dadosRetorno.dadosUsuario);

    if (dadosUsuario.dados)
      return retorno(200, "Usuario gerado.", dadosRetorno, {
        usuario: dadosUsuario.dados
      });

    return retorno(
      400,
      "os dados para gravar o usuario estão inconsistentes",
      dadosRetorno,
      {},
      dadosUsuario.erros
    );
  },
  /**
   * Persistir o usuario.
   * @function {gravarUsuario}
   *
   * @param {Object} dadosRetorno
   * @param {Object} dadosRetorno.usuario - usuario gerado e validado para gravação.
   *
   * @returns {Object} {status: {codigo: number, mensagem: string}, ...dadosRetorno}.
   */
  gravarUsuario: async function(dadosRetorno) {
    if (dadosRetorno.status.codigo === 200) {
      const r = await repositorioUsuario.gravar(dadosRetorno.usuario);
      return retorno(r.status.codigo, r.status.mensagem, dadosRetorno);
    }
    return dadosRetorno;
  }
});
