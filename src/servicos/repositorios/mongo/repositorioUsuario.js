const { compose } = require("ramda");
const { usuario } = require("../../../modelos");
const { retorno } = require("../../../lib/util");

const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);

/**
 * @module {repositorioUsuario} - módulo para persistência e recuperação do usuario.
 * @param {Object} conexao - objeto de conexao com o MongoDB.
 */
module.exports = conexao => ({
  /**
   * Obtém um usuario pelo id ou email.
   * @function {obter}
   *
   * @param {Object} dadosUsuario
   * @param {string} dadosUsuario.id - uuid ou email do usuario para busca.
   *
   * @returns {object} {status: {codigo: number, mensagem: string}, usuario: Object}.
   */
  obter: async function(dadosUsuario) {
    const validarParametro = dadosUsuario => {
      if (!dadosUsuario || !dadosUsuario.id)
        return retorno(400, "dados do usuario inválido: {id: string}");

      return retorno(200, "", {}, { dadosUsuario });
    };

    const recuperarUsuario = async dadosRetorno => {
      if (dadosRetorno.status.codigo === 200) {
        const r = await conexao.collection("Usuarios").findOne({
          $or: [
            { id: dadosRetorno.dadosUsuario.id },
            { email: dadosRetorno.dadosUsuario.email }
          ]
        });
        if (r) {
          const uc = usuario.criar(r);
          if (uc.dados)
            return retorno(
              200,
              "usuario recuperado.",
              {},
              { usuario: uc.dados }
            );
          else
            return retorno(
              400,
              "usuario com dados inconsistentes.",
              {},
              {},
              uc.erros
            );
        }
        return retorno(404, "usuario não encontrado.");
      }
      return dadosRetorno;
    };

    // Processar...
    const processarObter = compose(recuperarUsuario, validarParametro);
    return await processarObter(dadosUsuario);
  },
  /**
	 * Obtém um login pelo email.
	 * @function {obter}
	 * 
	 * @param {Object} dadosLogin
	 * @param {string} dadosLogin.email - email do login para busca.
	 * 
	 * @returns {object} {status: {codigo: number, mensagem: string}, login: Object}.
	 */
	obterPorEmail: async function (dadosLogin) {

		const validarParametro = (dadosLogin) => {
			if (!dadosLogin || !dadosLogin.email)
				return retorno(400, 'dados do login inválido: {email: string}');

			return retorno(200, '', {}, { dadosLogin });
		}

		const recuperarLogin = async (dadosRetorno) => {
			if (dadosRetorno.status.codigo === 200) {
				const r = await conexao.collection('Usuarios').findOne({ email: dadosRetorno.dadosLogin.email });
				if (r) {
					const uc = usuario.criar(r);
					if (uc.dados)
						return retorno(200, 'login recuperado.', {}, { login: uc.dados });
					else
						return retorno(400, 'login com dados inconsistentes.', {}, {}, uc.erros);
				}
				return retorno(404, 'login não encontrado.');
			}
			return dadosRetorno;
		}

		// Processar...
		const processarObter = compose(recuperarLogin, validarParametro);
		return await processarObter(dadosLogin);
	},
  /**
   * Insere um novo usuario ou altera um usuario existente.
   * @function {gravar}
   *
   * @param {string} dadosUsuario.id [opcional] - id do usuario.
   * @param {string} dadosUsuario.nome - nome do usuario.
   * @param {string} dadosUsuario.identificacao - identificação do usuario.
   * @param {string} dadosUsuario.email - email do usuario.
   * @param {string} dadosUsuario.senha - senha do usuario.
   *
   * @returns {Object} { status: {codigo: number, mensagem: string }}
   */
  gravar: async function(dadosUsuario) {
    const validarUsuario = dadosUsuario => usuario.criar(dadosUsuario);

    const inserirUsuario = async dadosUsuario => {
      try {
        await conexao.collection("Usuarios").insertOne({
          ...dadosUsuario,
          senha: bcrypt.hashSync(dadosUsuario.senha, salt)
        });
        return retorno(201, "usuario incluso com sucesso.");
      } catch (err) {
        console.error(
          "[ERRO]",
          "[servicos.repositorios.mongo.repositorioUsuario.gravar.inserirUsuario]",
          `[${err.message}]`,
          err
        );
        return retorno(500, "erro interno ao inserir o usuario");
      }
    };

    const alterarUsuario = async dadosUsuario => {
      const r = await conexao.collection("Usuarios").updateOne(
        {
          id: dadosUsuario.id
        },
        {
          $set: {
            nome: dadosUsuario.nome,
            email: dadosUsuario.email,
            bio: dadosUsuario.bio,
            senha: bcrypt.hashSync(dadosUsuario.senha, salt)
          }
        }
      );
      const codigo = r.result.ok != 1 || r.result.nModified < 1 ? 404 : 200;
      const mensagem =
        codigo === 200
          ? "usuario alterado com sucesso."
          : "nenhum usuario alterado.";

      return retorno(codigo, mensagem);
    };

    const gravaUsuario = async retornoUsuario => {
      if (retornoUsuario.dados) {
        const r = await this.obter(retornoUsuario.dados);
        if (![200, 404].includes(r.status.codigo)) return r;

        return r.status.codigo === 200
          ? await alterarUsuario({ ...retornoUsuario.dados })
          : await inserirUsuario({ ...retornoUsuario.dados });
      } else {
        return retorno(
          400,
          "dados inconsistentes no usuario",
          {},
          {},
          retornoUsuario.errors
        );
      }
    };

    // Processar ...
    return await compose(gravaUsuario, validarUsuario)(dadosUsuario);
  }
});
