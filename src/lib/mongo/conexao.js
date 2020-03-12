const MongoClient = require("mongodb").MongoClient;
const { compose, curry, then } = require("ramda");

/**
 * @module {conexao} - módulo criar a conexão com o MongoDB.
 */
module.exports = {
  /**
   * Normalizar parâmetro de conexão inserindo valores padrão.
   * @param {object} parametros - parâmetros de conexão: {protocolo: string, endereco: string, porta: string, usuario: string, senha: string, nomeDB: string}
   * @returns {object} parâmetros normalizados com valores padrão.
   */
  normalizarParametros: function(parametros) {
    return {
      protocolo: parametros.protocolo || "mongodb://",
      endereco: parametros.endereco,
      porta: parametros.porta || "27017",
      usuario: parametros.usuario,
      senha: parametros.senha,
      nomeDB: parametros.nomeDB
    };
  },

  /**
   * Gerar string com URL para conexão com o banco.
   * @param {object} parametros - dados para conexão com o banco.
   * @returns {string} string de conexão.
   */
  gerarURLConexao: function(parametros) {
    if (
      !(
        parametros.protocolo &&
        parametros.endereco &&
        parametros.porta &&
        parametros.usuario &&
        parametros.senha &&
        parametros.nomeDB
      )
    )
      throw Error("[ERRO] > lib.mongo.Conexao: faltam dados para conexão");

    return `${parametros.protocolo}${parametros.usuario}:${parametros.senha}@${
      parametros.endereco
    }${parametros.protocolo.endsWith("srv://") ? "" : ":" + parametros.porta}`;
  },

  /**
   * Obter conexão com o MongoDB.
   * @param {string} url - url de conexão.
   */
  obterConexaoDB: function(url) {
    return new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  },

  /**
   * Obter objetos de conexão com o MongoDB.
   * @param {string} nomeDB - nome do banco de dados.
   * @param {object} conexaoDB - objeto de conexão com o MongoDB.
   * @returns {object} {conexao: object, conexaoDB: object}
   */
  obterObjetosConexao: curry(function(nomeDB, conexaoDB) {
    return new Promise((ok, erro) => {
      conexaoDB
        .connect()
        .then(conexaoDB => {
          const conexao = conexaoDB.db(nomeDB);
          ok({ conexao, conexaoDB });
        })
        .catch(err => erro(err));
    });
  }),

  /**
   * Cria os ídices nas tabelas do banco de dados.
   * @param {Object} conexaoMongo - { conexao: Object, conexaoDB: Object }
   */
  criarIndices: function(conexaoMongo) {
    return new Promise(async ok => {
      await conexaoMongo.conexao
        .collection("Usuarios")
        .createIndex({ id: 1 }, { unique: true, name: "id" });

      await conexaoMongo.conexao
        .collection("Usuarios")
        .createIndex({ email: 1 }, { unique: true, name: "email" });

      await conexaoMongo.conexao
        .collection("Logins")
        .createIndex({ id: 1 }, { unique: true, name: "id" });

      await conexaoMongo.conexao
        .collection("Logins")
        .createIndex({ token: 1 }, { unique: true, name: "token" });

      ok(conexaoMongo);
    });
  },

  /**
   * Criar objetos de conexão com o MongoDB
   * @param {object} parametros - parâmetros para conexão: {protocolo: string, endereco: string, porta: string, usuario: string, senha: string, nomeDB: string}.
   * @returns {Promise} que será resolvida com os objetos de conexão com o MongoDB: {conexao: object, conexaoDB: object}.
   */
  criar: function(parametros) {
    return compose(
      then(this.criarIndices),
      this.obterObjetosConexao(parametros.nomeDB),
      this.obterConexaoDB,
      this.gerarURLConexao,
      this.normalizarParametros
    )(parametros);
  }
};
