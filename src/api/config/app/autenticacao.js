const jwt = require("jsonwebtoken");
const configuracao = process.env.SEGREDO;
const { retornoAPI } = require("../../../lib/util");
const { compose, then } = require("ramda");

/**
 * Módulo para inserir os middleware de autenticação.
 * @param {express} app - app express.
 * @returns {express} app com middleware injetado.
 */
module.exports = conexao => app => {
  /**
   * Injetar middleware no aplicativo.
   *
   * @param {Request} req - request do express.
   * @param {Response} res - response do express.
   * @param {Next} next - chamada do próximo middleware do express.
   *
   * @returns {express} app com middlewares injetados.
   */
  const autenticador = (req, res, next) => {
    const verificarPathLiberado = () => {
      pathsLiberados = ["/", "/logar", "/cadastrar"];

      if (pathsLiberados.includes(req.path)) {
        return { erro: "", dados: null, pathLiberado: true };
      }
      return { erro: "", dados: null, pathLiberado: false };
    };

    const pegarCabecalhoAutorizacao = entrada => {
      if (entrada.pathLiberado) return entrada;

      const c = req.headers["authorization"];

      if (!c)
        return {
          erro: "cabeçalho de autorização não informado.",
          dados: null,
          pathLiberado: entrada.pathLiberado
        };

      const partes = c.split(" ");

      if (!partes.length === 2)
        return {
          erro: "cabeçalho de autorização inválido.",
          dados: null,
          pathLiberado: entrada.pathLiberado
        };

      const [esquema, token] = partes;

      if (!/^Bearer$/i.test(esquema))
        return {
          erro: "cabeçalho de autorização malformatado.",
          dados: null,
          pathLiberado: entrada.pathLiberado
        };

      return {
        erro: token ? "" : "cabeçalho de autorização inválido.",
        dados: token ? token : null,
        pathLiberado: entrada.pathLiberado
      };
    };
    const validarToken = entrada => {
      if (entrada.erro || entrada.pathLiberado) return entrada;

      const decoded = jwt.verify(entrada.dados, configuracao);

      const usuario_id = decoded.id;

      return {
        erro: usuario_id ? "" : "token de autorização expirado.",
        dados: usuario_id ? usuario_id : null,
        pathLiberado: entrada.pathLiberado
      };
    };
    const validarAutorizacao = async entrada => {
      if (entrada.erro || entrada.pathLiberado) return entrada;

      const r = await conexao
        .collection("Usuarios")
        .findOne({ id: entrada.dados });

      if (r) {
        return {
          erro: "",
          dados: { usuario_id: entrada.dados, permissoes: r.permissoes },
          pathLiberado: entrada.pathLiberado
        };
      }
      return {
        erro: "token inválido",
        dados: null,
        pathLiberado: entrada.pathLiberado
      };
    };

    const injetarDadosLogin = entrada => {
      if (entrada.erro || entrada.pathLiberado) return entrada;

      req.login = entrada.dados;

      return {
        erro: "",
        dados: null,
        pathLiberado: entrada.pathLiberado
      };
    };

    const autenticar = compose(
      then(injetarDadosLogin),
      validarAutorizacao,
      validarToken,
      pegarCabecalhoAutorizacao,
      verificarPathLiberado
    );
    autenticar().then(r => {
      if (r.erro) res.status(401).json(retornoAPI(401, r.erro));
      else next();
    });
  };

  app.use(autenticador);

  return app;
};
