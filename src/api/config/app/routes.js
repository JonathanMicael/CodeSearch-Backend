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

  app.get("/codigos",async (req, res) => await controle.executar("listarCodigos", req, res));
  app.get("/codigo/:id",async (req, res) => await controle.executar("obterCodigos", req, res));
  app.post("/codigo",async (req, res) => await controle.executar("gravarCodigo", req, res));
  app.put("/codigo/:id", async (req, res) => await controle.executar("gravarCodigo", req, res));
  app.delete("/codigo/:id", async (req, res) => await controle.executar("apagarCodigo", req, res));
  
  app.get("/arquivos",async (req, res) => await controle.executar("listarArquivos", req, res));
  app.post("/arquivo",async (req, res) => await controle.executar("gravarArquivo", req, res));
  app.put("/arquivo/:id", async (req, res) => await controle.executar("alterarArquivo", req, res));
  app.post("/arquivos", async (req, res) => await controle.executar("obterArquivos", req, res));
  app.delete("/arquivo/:id", async (req, res) => await controle.executar("apagarArquivo", req, res));
  
  

  // app.put("/arquivos",async (req, res) => await controle.executar("alterarArquivos", req, res));
  // app.post('/codigos/arquivos', async (req, res) => await controle.executar('incluirArquivoCodigo', req, res));
  // app.put('/codigos/arquivos', async (req, res) => await controle.executar('incluirArquivoCodigo', req, res));

  // app.post('/logins', async (req, res) => await controle.executar('incluirLogin', req, res));
  // app.get('/logins/:id', async (req, res) => await controle.executar('obterLogin', req, res));
  // app.get('/logins', async (req, res) => await controle.executar('listarLogins', req, res));

  return app;
};
