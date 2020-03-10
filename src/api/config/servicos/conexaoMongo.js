/**
 * @module {conexaoMongo} - módulo para configuração da conexão com o MongoDB.
 * @param {conexao} conexao - serviço para gerar uma conexão com o MongoDB.
 * @returns {Object} conexao com MongoDB gerado pelo MongoClient.
 */
module.exports = async conexao => {
  const parametros = {
    protocolo:
      process.env.AMBIENTE === "prod"
        ? process.env.MONGODB_PROTOCOLO
        : process.env.MONGODB_PROTOCOLO_TEST,
    endereco:
      process.env.AMBIENTE === "prod"
        ? process.env.MONGODB_ENDERECO
        : process.env.MONGODB_ENDERECO_TEST,
    porta:
      process.env.AMBIENTE === "prod"
        ? process.env.MONGODB_PORTA
        : process.env.MONGODB_PORTA_TEST,
    usuario:
      process.env.AMBIENTE === "prod"
        ? process.env.MONGODB_USUARIO
        : process.env.MONGODB_USUARIO_TEST,
    senha:
      process.env.AMBIENTE === "prod"
        ? process.env.MONGODB_SENHA
        : process.env.MONGODB_SENHA_TEST,
    nomeDB:
      process.env.AMBIENTE === "prod"
        ? process.env.MONGODB_NOMEDB
        : process.env.MONGODB_NOMEDB_TEST
  };
  const conexaoMongo = await conexao.criar(parametros);

  return conexaoMongo.conexao;
};
