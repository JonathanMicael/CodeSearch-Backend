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
       * Requisição DELETE para apagar arquivo.
       * @param {object} req - requisição do express.
       * @returns {Object} {status: {codigo: number, mensagem: string}}.
       */
      apagarArquivo: async req => {
        const { id } = req.params;
        const r = await interfaces.entradaComandos.executar("apagarArquivo", {
          id
        });
        return r;
      },
      /**
       * Requisição PUT para alterar um arquivo.
       * @param {object} req - requisição do express.
       * @returns {Object} {status: {codigo: number, mensagem: string}}.
       */
      alterarArquivo: async req => {
        const { id } = req.params;
        const {
          originalname: nome,
          size: tamanho,
          filename: chave,
          path: url = "vazio"
        } = req.file;
        const { titulo } = req.body;
        const r = await interfaces.entradaComandos.executar("alterarArquivo", {
          id,
          titulo,
          nome,
          tamanho,
          chave,
          url
        });

        return r;
      },
      /**
       * Requisição POST e PUT para gravar um Arquivo ou alterar um Arquivo.
       * @param {object} req - requisição do express.
       * @returns {Object} {status: {codigo: number, mensagem: string}, dados: Object}.
       */
      gravarArquivo: async req => {
        const { id } = req.params;
        const { titulo } = req.body;
        const {
          originalname: nome,
          size: tamanho,
          filename: chave,
          path: url = "vazio"
        } = req.file;

        const r = await interfaces.entradaComandos.executar("gravarArquivo", {
          id,
          titulo,
          nome,
          tamanho,
          chave,
          url
        });
        return r;
      },
      /**
       * Requisição POST para obter um arquivos.
       * @param {object} req - web req data
       * @returns {Object} {status: {codigo: number, mensagem: string}, dados: object}.
       */
      obterArquivos: async req => {
        const { id } = req.params;
        const { titulo } = req.body;
        const r = await interfaces.entradaConsultas.executar("obterArquivos", {
          id,
          titulo
        });
        return r;
      },
      /**
       * Requisição GET para obter uma lista dos arquivos.
       * @param {object} req - web req data
       * @returns {Object} {status: {codigo: number, mensagem: string}, dados: Object}.
       */
      listarArquivos: async req => {
        const r = await interfaces.entradaConsultas.executar("listarArquivos");
        return r;
      },

      /**
       * Requisição DELETE para apagar codigo.
       * @param {object} req - requisição do express.
       * @returns {Object} {status: {codigo: number, mensagem: string}}.
       */
      apagarCodigo: async req => {
        const { id } = req.params;
        const r = await interfaces.entradaComandos.executar("apagarCodigo", {
          id
        });
        return r;
      },
      /**
       * Requisição POST e PUT para gravar um Codigo ou alterar um Codigo.
       * @param {object} req - requisição do express.
       * @returns {Object} {status: {codigo: number, mensagem: string}, dados: Object}.
       */
      gravarCodigo: async req => {
        const { autor, titulo, descricao, tecs, conteudo } = req.body;
        const { id } = req.params;
        const r = await interfaces.entradaComandos.executar("gravarCodigo", {
          id,
          autor,
          titulo,
          descricao,
          tecs,
          conteudo
        });
        return r;
      },
      /**
       * Requisição POST para obter um codigo.
       * @param {object} req - web req data
       * @returns {Object} {status: {codigo: number, mensagem: string}, dados: object}.
       */
      obterCodigos: async req => {
        const { id } = req.params;
        const { titulo } = req.body;
        const r = await interfaces.entradaConsultas.executar("obterCodigos", {
          id,
          titulo
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
          senha
        });
        return r;
      },
      /**
       * Requisição GET para obter uma lista dos usuarios.
       * @param {object} req - web req data
       * @returns {Object} {status: {codigo: number, mensagem: string}, dados: Object}.
       */
      listarUsuarios: async req => {
        const r = await interfaces.entradaConsultas.executar("listarUsuarios");
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
      }
      // /**
      //  * Requisição POST para incluir um login.
      //  * @param {Object} req - requisição do express.
      //  * @returns {Object} {status: {codigo: number, mensagem: string}, dados: Object}.
      //  */
      // incluirLogin: async req => {
      //   const { email, senha } = req.body;
      //   const r = await interfaces.entradaComandos.executar("incluirLogin", {
      //     email,
      //     senha
      //   });
      //   return r;
      // },
      // /**
      //  * Requisição GET para obter um login.
      //  * @param {Object} req - requisição do express.
      //  * @returns {Object} {status: {codigo: number, mensagem: string}, dados: Object}.
      //  */
      // obterLogin: async req => {
      //   const { id } = req.body;
      //   const r = await interfaces.entradaConsultas.executar("obterLogin", {
      //     id
      //   });
      //   return r;
      // },
      // /**
      //  * Requisição GET para listar os logins.
      //  * @param {Object} req - requisição do express.
      //  * @returns {Object} {status: {codigo: number, mensagem: string}, dados: Object[]}.
      //  */
      // listarLogins: async req => {
      //   const r = await interfaces.entradaConsultas.executar("listarLogins");
      //   return r;
      // },

      /**
      //  * Requisição POST e PUT para inlucir uma nova entrada em um arquivo.
      //  * @param {object} req - requisição do express.
      //  * @returns {Object} {status: {codigo: number, mensagem: string}, dados: Object[]}.
      //  */
      // incluirArquivoCodigo: async req => {
      //   const { titulo } = req.body;
      //   const r = await interfaces.entradaComandos.executar(
      //     "incluirArquivoCodigo",
      //     { titulo, arquivo: req.file }
      //   );
      //   return r;
      // },

      // /**
      //  * Requisição PUT para inlucir uma nova entrada em um arquivo.
      //  * @param {object} req - requisição do express.
      //  * @returns {Object} {status: {codigo: number, mensagem: string}, dados: Object[]}.
      //  */
      // alterarArquivos: async req => {
      //   const { titulo } = req.body;
      //   const r = await interfaces.entradaComandos.executar("alterarArquivos", {
      //     titulo,
      //     arquivos: req.file
      //   });
      //   return r;
      // },

      // /**
      //  * Requisição GET para obter os codigos.
      //  * @param {object} req - web req data
      //  * @returns {Object} {status: {codigo: number, mensagem: string}, dados: object}.
      //  */
      // obterCodigos: async req => {
      //   const { titulo } = req.body;
      //   const r = await interfaces.entradaConsultas.executar("obterCodigos", {
      //     titulo
      //   });
      //   return r;
      // },
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
