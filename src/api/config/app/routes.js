const pj = require("../../../../package.json");
const { retornoAPI } = require("../../../lib/util");

/**
 * Módulo para configurar as rotas da api.
 * @param {controle} controle - controle da api.
 * @param {express} app - app express.
 * @returns {express} app express com rotas configuradas.
 */
module.exports = controle => app => {
  // Rota inicial da Aplicação
  app.get("/", (_, res) =>
    res.status(200).json(retornoAPI(200, `CODESEARCH versão: ${pj.version}`))
  );

  // Crud de arquivo da Aplicação
  app.put('/usuario/:id', async (req, res) => await controle.executar('gravarUsuario', req, res));
  app.get('/usuarios/:id', async (req, res) => await controle.executar('obterUsuario', req, res));
  app.get('/usuarios', async (req, res) => await controle.executar('listarUsuarios', req, res));
  //app.delete("/usuario/:id", async (req, res) => await controle.executar("apagarUsuario", req, res));
  
  // Login e Registro na Aplicação
  app.post("/cadastrar",async (req, res) => await controle.executar("gravarUsuario", req, res));
  app.post("/logar",async (req, res) => await controle.executar("logarUsuario", req, res));

  // Crud de codigo da Aplicação
  app.get("/codigos",async (req, res) => await controle.executar("listarCodigos", req, res));
  app.get("/codigo/:id",async (req, res) => await controle.executar("obterCodigos", req, res));
  app.post("/codigo",async (req, res) => await controle.executar("gravarCodigo", req, res));
  app.put("/codigo/:id", async (req, res) => await controle.executar("gravarCodigo", req, res));
  app.delete("/codigo/:id", async (req, res) => await controle.executar("apagarCodigo", req, res));
  
  // Crud de arquivo da Aplicação
  app.get("/arquivos",async (req, res) => await controle.executar("listarArquivos", req, res));
  app.post("/arquivo",async (req, res) => await controle.executar("gravarArquivo", req, res));
  app.put("/arquivo/:id", async (req, res) => await controle.executar("alterarArquivo", req, res));
  app.get("/arquivos/:id", async (req, res) => await controle.executar("obterArquivos", req, res));
  app.delete("/arquivo/:id", async (req, res) => await controle.executar("apagarArquivo", req, res));
  
  return app;
};
