const { retornoAPI } = require("../lib/util");

/**
 * Módulo para controle da api.
 * @param {Object} interfaces - interfaces de comandos e consultas do serviço.
 */
module.exports = interfaces => ({
  /**
   * Método global para execução e tratamento de erros retornados dos comandos e consultas.
   * @param {string} nomeMetodo - Nome do método de controle definido no objeto 'requisicoes'
   * @param {Object} req - requisição do express.
   * @param {Object} res - resposta do express.
   */
  executar: async (nomeMetodo, req, res) => {
    const requisicoes = {
      /**
       * Requisição POST para incluir um login.
       * @param {Object} req - requisição do express.
       * @returns {Object} {status: {codigo: number, mensagem: string}, dados: Object}.
       */
      incluirLogin: async req => {
        const { email, senha } = req.body;
        const r = await interfaces.entradaComandos.executar("incluirLogin", {
          email,
          senha
        });
        return r;
      },
      /**
       * Requisição GET para obter um login.
       * @param {Object} req - requisição do express.
       * @returns {Object} {status: {codigo: number, mensagem: string}, dados: Object}.
       */
      obterLogin: async req => {
        const { id } = req.body;
        const r = await interfaces.entradaConsultas.executar("obterLogin", {
          id
        });
        return r;
      },
      /**
       * Requisição GET para listar os logins.
       * @param {Object} req - requisição do express.
       * @returns {Object} {status: {codigo: number, mensagem: string}, dados: Object[]}.
       */
      listarLogins: async req => {
        const r = await interfaces.entradaConsultas.executar("listarLogins");
        return r;
      },
      /**
       * Requisição PUT para inlucir uma nova entrada em um template.
       * @param {object} req - requisição do express.
       * @returns {Object} {status: {codigo: number, mensagem: string}, dados: Object[]}.
       */
      alterarArquivos: async req => {
        const { titulo } = req.body;
        const r = await interfaces.entradaComandos.executar("alterarArquivos", {
          titulo,
          arquivos: req.files
        });
        return r;
      },

      /**
       * Requisição GET para obter uma lista dos codigos.
       * @param {object} req - web req data
       * @returns {Object} {status: {codigo: number, mensagem: string}, dados: Object}.
       */
      listarCodigos: async req => {
        const r = await interfaces.entradaConsultas.executar("listarCodigos");
        return r;
      },
      /**
       * Requisição POST para gravar um codigo.
       * @param {object} req - requisição do express.
       * @returns {Object} {status: {codigo: number, mensagem: string}, dados: Object}.
       */
      gravarCodigo: async req => {
        const { id, autor, titulo, descricao, tecs, conteudo } = req.body;
        const r = await interfaces.entradaComandos.executar("gravarCodigo", {
          id,
          autor,
          titulo,
          descricao,
          tecs,
          conteudo,
          arquivos: req.files
        });
        return r;
      },

      /**
       * Requisição POST para obter os codigos.
       * @param {object} req - web req data
       * @returns {Object} {status: {codigo: number, mensagem: string}, dados: object}.
       */
      obterCodigos: async req => {
        const { titulo } = req.body;
        const r = await interfaces.entradaConsultas.executar("obterCodigos", {
          titulo
        });
        return r;
      },
      /**
       * Requisição POST para gravar um usuario.
       * @param {object} req - requisição do express.
       * @returns {Object} {status: {codigo: number, mensagem: string}, dados: Object}.
       */
      gravarUsuario: async req => {
        const { id, nome, bio, email, senha } = req.body;
        const r = await interfaces.entradaComandos.executar("gravarUsuario", {
          id,
          nome,
          bio,
          email,
          senha,
          role: "usuario"
        });
        return r;
      },
      /**
       * Requisição GET para obter um usuario.
       * @param {object} req - web req data
       * @returns {Object} {status: {codigo: number, mensagem: string}, dados: object}.
       */
      obterUsuario: async req => {
        const { id } = req.params;
        const r = await interfaces.entradaConsultas.executar("obterUsuario", {
          id
        });
        return r;
      },
      /**
       * Requisição GET para obter uma lista dos Usuarios.
       * @param {object} req - web req data
       * @returns {Object} {status: {codigo: number, mensagem: string}, dados: Object}.
       */
      listarUsuarios: async req => {
        const r = await interfaces.entradaConsultas.executar("listarUsuarios");
        return r;
      }
    };
    try {
      const r = await requisicoes[nomeMetodo](req);
      return res
        .status(r.status.codigo)
        .json(retornoAPI(r.status.codigo, r.status.mensagem, r.dados));
    } catch (err) {
      console.error(
        "[ERRO]",
        "[api.controle.executar]",
        `[${err.message}]`,
        err
      );
      return res
        .status(500)
        .json(
          retornoAPI(
            500,
            "Ops.. aconteceu algum problema em nosso serviço. Por favor tente novamente em instantes."
          )
        );
    }
  }
});
