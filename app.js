const express = require('express');
const { compose, then } = require('ramda');
const { conexao } = require('./src/lib/mongo');
const { controle } = require('./src/api')
const { conexaoMongo, interfaces, repositorios } = require('./src/api/config/servicos')
const { autenticacao, middlewares, rotas } = require('./src/api/config/app')

/**
 * Cria aplicação express configurada e com os serviços injetados.
 */
const inicializarApp = async () => {

	/**
	 * Inicializa todos os serviços.
	 * @param {conexao} conexao - serviço para gerar uma conexão com o MongoDB.
	 * @returns {controle} controle da api.
 	 */
	const criarServicos = (conexao) => {
		const _c = compose(controle, interfaces, repositorios);
		const _controle = _c(conexao);

		return _controle;
	};

	/**
	 * Configura app express.
	 * @param {conexao} conexao - conexão com o MongoDB.
	 * @param {controle} controle - controle da api.
	 * @returns {express} app express configurada.
	 */
	const configurarApp = (conexao) => (controle) => {

		const criarApp = () => express();
		const configurarMiddlewares = (app) => middlewares(app);
		const configurarAutenticacao = (app) => autenticacao(conexao)(app);
		const configurarRotas = rotas(controle);

		const _c = compose(configurarRotas, configurarAutenticacao, configurarMiddlewares, criarApp);
		const _app = _c();

		return _app;
	}
	
	// Criar app...
	const con = await conexaoMongo(conexao);

	const criarAPP = compose(configurarApp(con), criarServicos);
	const _app = criarAPP(con);

	return _app;
}

module.exports = inicializarApp;