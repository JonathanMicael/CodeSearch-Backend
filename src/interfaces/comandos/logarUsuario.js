const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const configuracao = process.env.SEGREDO;
const { usuario } = require("../../modelos");
const { processamento, retorno } = require("../../lib/util");

/**
 * @module {logarUsuario} - comando para logar um usuario.
 * @param {repositorioUsuario} repositorioUsuario - repositório do usuario.
 */
module.exports = repositorioUsuario => ({
  /**
   * Executar o comando para logar um usuario.
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
      this.obterUsuario,
      this.gerarLogin
    );
    const r = await p(parametro);

    return retorno(r.status.codigo, r.status.mensagem, r);
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
   * Obter um usuario com os dados.
   * @function {obterUsuario}
   *
   * @param {Object} dadosRetorno
   * @param {Object} dadosRetorno.dadosLogin - objeto com informações do usuario para logar.
   *
   * @returns {Object} {status: {codigo: number, mensagem: string}, ...dadosRetorno, logar: Object}.
   */
  obterUsuario: async function(dadosRetorno) {
    const dadosLogin = await repositorioUsuario.obterPorEmail(
      dadosRetorno.dadosLogin
    );
      if(dadosLogin.login)
        return retorno(200, "usuario recuperado.", dadosRetorno, {
          login: dadosLogin.login
        });
      
      if(!dadosLogin.status.codigo !== 200)
      return retorno(404, 'o email informado não está cadastrado.', dadosRetorno, {}, dadosLogin.erros)
    
    return retorno(
      400,
      "os dados para logar estão inconsistentes",
      dadosRetorno,
      {},
      dadosLogin.erros
    );
  },
  /**
   * gerar login com os dados retornados.
   * @function {gerarLogin}
   *
   * @param {Object} dadosUsuario
   * @param {Object} dadosUsuario.login - objeto com informações do usuario para verificar.
   *
   * @returns {Object} {status: {codigo: number, mensagem: string}, ...dadosRetorno, token: String}.
   */
  gerarLogin: async function(dadosUsuario) {
    const verificaSenha = await bcrypt.compare(
      dadosUsuario.dadosLogin.senha,
      dadosUsuario.login.senha
    );

    if (!verificaSenha)
      return retorno(400, "a senha informada não é a correta.", dadosUsuario);

    const token = jwt.sign({ id: dadosUsuario.login.id }, configuracao, {
      expiresIn: 86400
    });

    return retorno(200, "usuario logado com sucesso.", dadosUsuario, {
      dados: { ...dadosUsuario.login, senha: "", token }
    });
  }
});
