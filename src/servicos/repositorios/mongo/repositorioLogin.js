const { compose } = require("ramda");
const { login } = require("../../../modelos");
const jwt = require("jsonwebtoken");
const { retorno } = require("../../../lib/util");

/**
 * @module {repositorioLogin} - módulo para persistência e recuperação do login.
 * @param {Object} conexao - objeto de conexao com o MongoDB.
 */
module.exports = conexao => ({
  /**
   * Obtém um usuario pelo email.
   * @function {obter}
   *
   * @param {Object} dadosLogin
   * @param {string} dadosLogin.email - email para busca.
   *
   * @returns {object} {status: {codigo: number, mensagem: string}, login: Object}.
   */
  obter: async function(dadosLogin) {
    const validarParametro = dadosLogin => {
      if (!dadosLogin || !dadosLogin.email)
        return retorno(400, "dados do login inválido: {email: string}");

      return retorno(200, "", {}, { dadosLogin });
    };

    const recuperarLogin = async dadosRetorno => {
      if (dadosRetorno.status.codigo === 200) {
        const r = await conexao.collection("Usuarios").findOne({
          $or: [{ email: dadosRetorno.dadosLogin.email }]
        });
        if (r) {
          const token = jwt.sign({ sub: r.id }, "testessdsds");
          const log = login.criar({ id: r.id, token });
          if (log.dados)
            return retorno(200, "login recuperado.", {}, { login: log.dados });
          else
            return retorno(
              400,
              "login com dados inconsistentes.",
              {},
              {},
              log.erros
            );
        }
        return retorno(404, "login não encontrado.");
      }
      return dadosRetorno;
    };

    // Processar...
    const processarObter = compose(recuperarLogin, validarParametro);
    return await processarObter(dadosLogin);
  },
  obterById: async function(dadosLogin) {
    const validarParametro = dadosLogin => {
      if (!dadosLogin || !dadosLogin.id)
        return retorno(400, "dados do login inválido: {id: string}");

      return retorno(200, "", {}, { dadosLogin });
    };

    const recuperarLogin = async dadosRetorno => {
      if (dadosRetorno.status.codigo === 200) {
        const r = await conexao.collection("Logins").findOne({
          $or: [{ id: dadosRetorno.dadosLogin.id }]
        });
        if (r) {
          const log = login.criar({ id: r.id, token: r.token });
          if (log.dados)
            return retorno(200, "login recuperado.", {}, { login: log.dados });
          else
            return retorno(
              400,
              "login com dados inconsistentes.",
              {},
              {},
              log.erros
            );
        }
        return retorno(404, "login não encontrado.");
      }
      return dadosRetorno;
    };

    // Processar...
    const processarObter = compose(recuperarLogin, validarParametro);
    return await processarObter(dadosLogin);
  },
  /**
   * Inclui um novo login ou altera um login existente.
   * @function {incluir}
   *
   * @param {string} dadosLogin.id - id do usuario.
   * @param {string} dadosLogin.token - nome do usuario.
   *
   * @returns {Object} { status: {codigo: number, mensagem: string }}
   */
  incluir: async function(dadosLogin) {
    const validarLogin = dadosLogin => login.criar(dadosLogin.login);

    const inserirLogin = async dadosLogin => {
      try {
        await conexao.collection("Logins").insertOne({
          ...dadosLogin
        });
        return retorno(201, "login incluso com sucesso.", {
          login: dadosLogin || {}
        });
      } catch (err) {
        console.error(
          "[ERRO]",
          "[servicos.repositorios.mongo.repositorioLogin.incluir.inserirLogin]",
          `[${err.message}]`,
          err
        );
        return retorno(500, "erro interno ao inserir o login");
      }
    };

    const alterarLogin = async dadosLogin => {
      const r = await conexao.collection("Logins").updateOne(
        {
          id: dadosLogin.id
        },
        {
          $set: {
            token: dadosLogin.token
          }
        }
      );
      const codigo = r.result.ok != 1 || r.result.nModified < 1 ? 404 : 200;
      const mensagem =
        codigo === 200
          ? "login alterado com sucesso."
          : "nenhum login alterado.";

      return retorno(codigo, mensagem, { login: dadosLogin });
    };

    const gravarLogin = async retornoLogin => {
      if (retornoLogin.dados) {
        const r = await this.obterById(retornoLogin.dados);
        if (![200, 404].includes(r.status.codigo)) return r;
        return r.status.codigo === 200
          ? await alterarLogin({ ...retornoLogin.dados })
          : await inserirLogin({ ...retornoLogin.dados });
      } else {
        return retorno(
          400,
          "dados inconsistentes no login",
          {},
          {},
          retornoLogin.errors
        );
      }
    };

    // Processar ...
    return await compose(gravarLogin, validarLogin)(dadosLogin);
  }
});
