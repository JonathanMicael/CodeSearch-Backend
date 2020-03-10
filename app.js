const express = require("express");
const { compose, then } = require("ramda");
const { conexao } = require("./src/lib/mongo");
const { controle } = require("./src/api");
const {
  conexaoMongo,
  interfaces,
  repositorios
} = require("./src/api/config/servicos");
const { middlewares, rotas } = require("./src/api/config/app");

/**
 * Cria aplicação express configurada e com os serviços injetados.
 */
const inicializarApp = async () => {
  /**
   * Inicializa todos os serviços.
   * @param {conexao} conexao - serviço para gerar uma conexão com o MongoDB.
   * @returns {controle} controle da api.
   */
  const criarServicos = async conexao => {
    const _c = compose(
      then(controle),
      then(interfaces),
      then(repositorios),
      conexaoMongo
    );
    const _controle = await _c(conexao);

    return _controle;
  };

  /**
   * Configura app express.
   * @param {controle} controle - controle da api.
   * @returns {express} app express configurada.
   */
  const configurarApp = controle => {
    const criarApp = () => express();
    const configurarMiddlewares = app => middlewares(app);
    const configurarRotas = rotas(controle);

    const _c = compose(configurarRotas, configurarMiddlewares, criarApp);
    const _app = _c();

    return _app;
  };

  // Criar app...
  const criarAPP = compose(then(configurarApp), criarServicos);
  const _app = await criarAPP(conexao);

  return _app;
};

module.exports = inicializarApp;
