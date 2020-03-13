const { login } = require("../../modelos");
const { usuario } = require("../../modelos");
const { processamento, retorno } = require("../../lib/util");

/**
 * @module {incluirLogin} - comando para incluir um novo login.
 * @param {repositorioLogin} repositorioLogin - repositório do login.
 */
module.exports = repositorioLogin => ({
  /**
   * Executar o comando para incluir um login.
   * @function {executar} - função obrigatório (interface) para todos os comandos.
   *
   * @param {Object} parametro
   * @param {string} parametro.email - email para login.
   * @param {string} parametro.senha - senha de acesso.
   *
   * @returns {Object}  {status: {codigo: number, mensagem: string}}.
   */
  executar: async function(parametro) {
    const p = processamento(
      this.validarParametro,
      this.gerarLogin,
      this.incluirLogin
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
      typeof parametro.email === "undefined" ||
      typeof parametro.senha === "undefined"
    )
      return retorno(400, "parâmetro inválido: {email: string, senha: string}");

    return retorno(200, "parâmetro válido.", {}, { dadosLogin: parametro });
  },

  /**
   * Gerar objeto com dados do usuario formatado.
   * @function {gerarUsuario}
   *
   * @param {Object} dadosRetorno
   * @param {Object} dadosRetorno.dadosUsuario - objeto com informações do usuario para gravar.
   *
   * @returns {Object} {status: {codigo: number, mensagem: string}, ...dadosRetorno, usuario: Object}.
   */
  gerarLogin: async function(dadosRetorno) {
    const verifica = await repositorioLogin.obter(dadosRetorno.dadosLogin);

    // VERIFICA
    if (verifica.login)
      return retorno(200, "login gerado.", dadosRetorno, {
        login: verifica.login
      });
    return retorno(
      400,
      "os dados para incluir o login estão inconsistentes",
      verifica,
      {},
      verifica.erros
    );
  },

  /**
   * Persistir o usuario.
   * @function {incluirLogin}
   *
   * @param {Object} dadosRetorno
   * @param {Object} dadosRetorno.login - login gerado e validado para gravação.
   *
   * @returns {Object} {status: {codigo: number, mensagem: string}, ...dadosRetorno}.
   */
  incluirLogin: async function(dadosRetorno) {
    if (dadosRetorno.status.codigo === 200) {
      const r = await repositorioLogin.incluir(dadosRetorno);
      return retorno(r.status.codigo, r.status.mensagem, {
        login: r.login || []
      });
    }
    return dadosRetorno;
  }
});
