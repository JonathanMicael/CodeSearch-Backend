const { retorno, retornoAPI } = require('../lib/util');
const { compose } = require('ramda');

/**
 * Módulo para controle da api.
 * @param {Object} interfaces - interfaces de comandos e consultas do serviço.
 */
module.exports = (interfaces) => ({

    /**
     * Método global para execução e tratamento de erros retornados dos comandos e consultas.
     * @param {string} nomeMetodo - Nome do método de controle definido no objeto 'requisicoes'
     * @param {Object} req - requisição do express.
     * @param {Object} res - resposta do express.
     */
    executar: async (nomeMetodo, req, res) => {

        const requisicoes = {
            /**
             * Requisição POST  para logar um usuario.
             * @param {object} req - requisição do express.
             * @returns {Object} {status: {codigo: number, mensagem: string}, dados: Object}.
             */
            logarUsuario: async req => {
              const { email, senha } = req.body;
              const r = await interfaces.entradaComandos.executar("logarUsuario", {
                email,
                senha
              });
              return r;
            },
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
             * Requisição POST e PUT para gravar um usuario ou alterar.
             * @param {object} req - requisição do express.
             * @returns {Object} {status: {codigo: number, mensagem: string}, dados: Object}.
             */
            gravarUsuario: async req => {
              const { id } = req.params;
              const { nome, bio, email, senha } = req.body;
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
        };

        const autorizacoes = {
           /**
           * Autorização na requisição POST para logar o usuario.
           * @param {Request} req - requisição do express.
           * @returns {Object} {status: {codigo: number, mensagem: string}}.
           */
          logarUsuario: (req) => {
            return retorno(200, 'usuário autorizado para logar na aplicação.');
          },
           /**
           * Autorização na requisição DELETE para apagar o arquivo.
           * @param {Request} req - requisição do express.
           * @returns {Object} {status: {codigo: number, mensagem: string}}.
           */
          apagarArquivo: (req) => {
            if (req.login) {
              if (req.login.permissoes.includes('usuario') || req.login.permissoes.includes('editor') || req.login.permissoes.includes('admin')) {
                return retorno(200, 'usuário autorizado para apagar o arquivo.');
              }
            }
            return retorno(403, 'usuário não autorizado para apagar o arquivo.');
          },
           /**
           * Autorização na requisição PUT para alterar o arquivo.
           * @param {Request} req - requisição do express.
           * @returns {Object} {status: {codigo: number, mensagem: string}}.
           */
          alterarArquivo: (req) => {
            if (req.login) {
              if (req.login.permissoes.includes('usuario') || req.login.permissoes.includes('editor') || req.login.permissoes.includes('admin')) {
                return retorno(200, 'usuário autorizado para alterar o arquivo.');
              }
            }
            return retorno(403, 'usuário não autorizado para alterar o arquivo.');
          },
           /**
           * Autorização na requisição POST para gravar o arquivo.
           * @param {Request} req - requisição do express.
           * @returns {Object} {status: {codigo: number, mensagem: string}}.
           */
          gravarArquivo: (req) => {
            if (req.login) {
              if (req.login.permissoes.includes('usuario') || req.login.permissoes.includes('editor') || req.login.permissoes.includes('admin')) {
                return retorno(200, 'usuário autorizado para gravar arquivo.');
              }
            }
            return retorno(403, 'usuário não autorizado para gravar arquivo.');
          },
           /**
           * Autorização na requisição POST para obter o arquivo.
           * @param {Request} req - requisição do express.
           * @returns {Object} {status: {codigo: number, mensagem: string}}.
           */
          obterArquivos: (req) => {
            if (req.login) {
              if (req.login.permissoes.includes('usuario') || req.login.permissoes.includes('editor') || req.login.permissoes.includes('admin')) {
                return retorno(200, 'usuário autorizado para obter arquivo.');
              }
            }
            return retorno(403, 'usuário não autorizado para obter arquivo.');
          },
           /**
           * Autorização na requisição GET para listar os arquivos.
           * @param {Request} req - requisição do express.
           * @returns {Object} {status: {codigo: number, mensagem: string}}.
           */
          listarArquivos: (req) => {
            if (req.login) {
              if (req.login.permissoes.includes('usuario') || req.login.permissoes.includes('editor') || req.login.permissoes.includes('admin')) {
                return retorno(200, 'usuário autorizado para listar arquivos.');
              }
            }
            return retorno(403, 'usuário não autorizado para listar arquivos.');
          },
           /**
           * Autorização na requisição POST para apagar o codigo.
           * @param {Request} req - requisição do express.
           * @returns {Object} {status: {codigo: number, mensagem: string}}.
           */
          apagarCodigo: (req) => {
            if (req.login) {
              if (req.login.permissoes.includes('usuario') || req.login.permissoes.includes('editor') || req.login.permissoes.includes('admin')) {
                return retorno(200, 'usuário autorizado para apagar codigos.');
              }
            }
            return retorno(403, 'usuário não autorizado para apagar codigo.');
          },
           /**
           * Autorização na requisição POST para gravar o codigo.
           * @param {Request} req - requisição do express.
           * @returns {Object} {status: {codigo: number, mensagem: string}}.
           */
          gravarCodigo: (req) => {
            if (req.login) {
              if (req.login.permissoes.includes('usuario') || req.login.permissoes.includes('editor') || req.login.permissoes.includes('admin')) {
                return retorno(200, 'usuário autorizado para gravar codigos.');
              }
            }
            return retorno(403, 'usuário não autorizado para gravar codigo.');
          },
           /**
           * Autorização na requisição GET para listar os codigos.
           * @param {Request} req - requisição do express.
           * @returns {Object} {status: {codigo: number, mensagem: string}}.
           */
          obterCodigos: (req) => {
            if (req.login) {
              if (req.login.permissoes.includes('usuario') || req.login.permissoes.includes('editor') || req.login.permissoes.includes('admin')) {
                return retorno(200, 'usuário autorizado para obter codigos.');
              }
            }
            return retorno(403, 'usuário não autorizado para obter codigo.');
          },
           /**
           * Autorização na requisição GET para listar os codigos.
           * @param {Request} req - requisição do express.
           * @returns {Object} {status: {codigo: number, mensagem: string}}.
           */
          listarCodigos: (req) => {
            if (req.login) {
              if (req.login.permissoes.includes('usuario') || req.login.permissoes.includes('editor') || req.login.permissoes.includes('admin')) {
                return retorno(200, 'usuário está logado para listar codigos.');
              }
            }
            return retorno(403, 'usuário não está logado para listar os codigos.');
          },
          /**
           * Autorização na requisição POST para gravar um usuario.
           * @param {Request} req - requisição do express.
           * @returns {Object} {status: {codigo: number, mensagem: string}}.
           */
          gravarUsuario: (req) => {
            return retorno(200, 'usuário autorizado para gravar o usuario.');
          },
          /**
           * Autorização na requisição GET para obter um usuario.
           * @param {Request} req - requisição do express.
           * @returns {Object} {status: {codigo: number, mensagem: string}}.
           */
          listarUsuarios: (req) => {
            if (req.login) {
              if (req.login.permissoes.includes('editor') || req.login.permissoes.includes('admin')) {
                return retorno(200, 'usuário autorizado para listar usuarios.');
              }
            }
            return retorno(403, 'usuário não autorizado para listar usuarios.');
          },
          /**
           * Autorização na requisição GET para obter um usuario.
           * @param {Request} req - requisição do express.
           * @returns {Object} {status: {codigo: number, mensagem: string}}.
           */
          obterUsuario: (req) => {
            if (req.login) {
              if (req.login.permissoes.includes('editor') || req.login.permissoes.includes('admin')) {
                return retorno(200, 'usuário autorizado para obter o usuario.');
              }
            }
            return retorno(403, 'usuário não autorizado para obter o usuario.');
          }
        };

        const executarAutorizacao = (req, autorizacoes, nomeMetodo) => autorizacoes[nomeMetodo](req);

        const executarRequisicao = (req, requisicoes, nomeMetodo) => async entrada => {
            if (entrada.status.codigo === 403)
                return entrada;
            
            return await requisicoes[nomeMetodo](req);
        }

        try {
            const executar = compose(
                executarRequisicao(req, requisicoes, nomeMetodo),
                executarAutorizacao
            );

            const r = await executar(req, autorizacoes, nomeMetodo);
            return res.status(r.status.codigo).json(retornoAPI(r.status.codigo, r.status.mensagem, r.dados));

        } catch (err) {
            console.error('[ERRO]', '[api.controle.executar]', `[${err.message}]`, err);
            return res.status(500).json(retornoAPI(
                500,
                "Ops.. aconteceu algum problema em nosso serviço. Por favor tente novamente em instantes."
            ));
        }
    }
});