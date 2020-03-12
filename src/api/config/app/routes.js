const pj = require("../../../../package.json");
const { retornoAPI } = require("../../../lib/util");

/**
 * Módulo para configurar as rotas da api.
 * @param {controle} controle - controle da api.
 * @param {express} app - app express.
 * @returns {express} app express com rotas configuradas.
 */
module.exports = controle => app => {
  app.get("/", (_, res) =>
    res.status(200).json(retornoAPI(200, `CODESEARCH versão: ${pj.version}`))
  );

  app.post("/usuarios",async (req, res) => await controle.executar("gravarUsuario", req, res));
  app.put('/usuarios', async (req, res) => await controle.executar('gravarUsuario', req, res));
  app.get('/usuarios/:id', async (req, res) => await controle.executar('obterUsuario', req, res));
  app.get('/usuarios', async (req, res) => await controle.executar('listarUsuarios', req, res));
  

  app.post('/logins', async (req, res) => await controle.executar('incluirLogin', req, res));
  app.get('/logins/:id', async (req, res) => await controle.executar('obterLogin', req, res));
  app.get('/logins', async (req, res) => await controle.executar('listarLogins', req, res));

  return app;
};
