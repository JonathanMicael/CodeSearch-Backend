const { compose, then } = require('ramda');
const { codigo } = require('../../../modelos');
const { retorno } = require('../../../lib/util');

/**
 * @module {repositorioCodigo} - módulo para persistência e recuperação do codigo.
 * @param {Object} conexao - objeto de conexao com o MongoDB.
 */
module.exports = conexao => ({
  	/**
	 * Obtém codigos pelo titulo.
	 * @function {obter}
	 * 
	 * @param {Object} dadosCodigo
	 * @param {string} dadosCodigo.titulo - titulo do codigo para busca.
	 * 
	 * @returns {object} {status: {codigo: number, mensagem: string}, codigo: Object}.
	 */
  obter: async function(dadosCodigo) {
      const validarParametros = (dadosCodigo) => {
        if(!dadosCodigo || !dadosCodigo.titulo) 
           return retorno(400, 'dados do codigo inválido: {titulo: string}')

          return retorno(200, '', {}, {dadosCodigo})
      }

      const recuperarCodigo = async (dadosRetorno) => {
        if(dadosRetorno.status.codigo === 200) {
          const r = await conexao.collection('Codigos').findOne({
            $or: [{titulo: dadosRetorno.dadosCodigo.titulo}]
          })
          if(r) {
						const cc = await codigo.criar(r)
            if(cc.dados) 
              return retorno(200, 'codigos recuperados com sucesso.', {}, {codigo: cc.dados})
            else
              return retorno(400, 'codigo com dados inconsistentes.', {}, {}, cc.erros)
          } 
          return retorno(404, 'codigos nao encontrados.')
        }
        return dadosRetorno
      }
      // Processar ....
      const processarObter = compose(recuperarCodigo, validarParametros);
      return await processarObter(dadosCodigo)
  },
  /**
	 * Obtém um codigo pela id e titulo.
	 * @function {obterAplicacaotitulo}
	 * 
	 * @param {Object} dadosCodigo - dados do codigo para busca.
	 * @param {string} dadosCodigo.id - id do codigo.
	 * @param {string} dadosCodigo.titulo - titulo do codigo.
	 * 
	 * @returns {Object} {status: {codigo: number, mensagem: string}, codigo: Object}.
	 */
	obterCodigoId: async function (dadosCodigo) {

		const validarParametro = (dadosCodigo) => {
			if (!dadosCodigo || typeof dadosCodigo.id == 'undefined' || typeof dadosCodigo.titulo == 'undefined')
				return retorno(400, 'dados do codigo inválido: {id: string, titulo: string}');

			return retorno(200, '', {}, {dadosCodigo});
		}

		const recuperarCodigo = async (dadosRetorno) => {
			if (dadosRetorno.status.codigo === 200) {
				const r = await conexao.collection('Codigos').findOne({ id: dadosRetorno.dadosCodigo.id, titulo: dadosRetorno.dadosCodigo.titulo });
				if (r) {
					const cc = codigo.criar(r);
					if (cc.dados)
						return retorno(200, 'codigo recuperado.', {}, { codigo: cc.dados });
					else
						return retorno(400, 'codigo com dados inconsistentes.', {}, {}, cc.erros);
				}
				return retorno(404, 'codigo não encontrado.');
			}
			return dadosRetorno;
		}

		// Processar...
		const processarObter = compose(recuperarCodigo, validarParametro);
		return await processarObter(dadosCodigo);
  },
  
  /**
	 * Inclui um novo codigo.
	 * @param {Object} dadosCodigo - dados do codigo para gravação.
	 * @returns {Object} { status: {codigo: number, mensagem: string }}
	 */
	gravar: async function (dadosCodigo) {

		const validarCodigo = dadosCodigo => codigo.criar(dadosCodigo);

		const verificarSeJaIncluso = async (retornoCodigo) => {
			if (retornoCodigo.dados) {
				const r = await this.obterCodigoId(retornoCodigo.dados);

				if (![200, 404].includes(r.status.codigo))
					return r;

				if (r.status.codigo === 200)
					return retorno(400, 'codigo já incluso.');

				return retorno(200, 'codigo não incluso.', {}, {dadosCodigo: retornoCodigo.dados});
			}
			return retorno(400, 'dados inválidos no codigo.', {}, {}, retornoCodigo.erros);
		};

		const uploadArquivos = async (dadosRetorno) => {
			
		}

		const incluirCodigo = async (dadosRetorno) => {
			if (dadosRetorno.status.codigo === 200) {
				try {
					await conexao.collection('Codigos').insertOne({ ...dadosRetorno.dadosCodigo });
					return retorno(201, 'codigo incluso com sucesso.');
				}
				catch (err) {
					console.error('[ERRO]', '[servicos.repositorios.mongo.repositorioCodigo.incluir]', `[${err.message}]`, err);
					return retorno(500, 'erro interno ao incluir um codigo.');
				}
			}
			return dadosRetorno;
		};

		// Incluir...
		const processarInclusao = compose(then(incluirCodigo), verificarSeJaIncluso, validarCodigo);
		
		return await processarInclusao(dadosCodigo);
	},

	/**
	 * Alterar os arquivos de um codigo.
	 * @function {alterarArquivos}
	 * 
	 * @param {Object} dadosCodigo - dados do codigo para alteração: {id: string, arquivos: Object[]}.
	 * @param {String} dadosCodigo.titulo - titulo do codigo.
	 * @param {Object[]} dadosCodigo.arquivos - array de arquivos para alteração.
	 * 
	 * @returns {Object} { status: {codigo: number, mensagem: string }}
	 */
	alterarArquivos: async function (dadosCodigo) {

		const validarParametro = dadosCodigo => {
			if (!dadosCodigo || typeof dadosCodigo.titulo == 'undefined' || !Array.isArray(dadosCodigo.arquivos))
				return retorno(400, 'dados do codigo inválido para alteração: {titulo: string, arquivos: Object[]}');

			return retorno(200, '', {}, {dadosCodigo});
		}

		const obterCodigo = async dadosRetorno => {
			if (dadosRetorno.status.codigo === 200)
				return await this.obter(dadosRetorno.dadosCodigo);

			return dadosRetorno;
		}

		const alterarArquivo = arquivos => dadosRetorno => {
			if (dadosRetorno.status.codigo === 200) {
				const r = codigo.atualizarArquivos(dadosRetorno.codigo, arquivos);
				if (r.erros.length > 0)
					return retorno(400, 'dados inconsistentes para atualizar os arquivos', {}, {}, r.erros);
				return retorno(200, 'Arquivos alterados', {}, {arquivoAlterado: r.dados})
			}
			return dadosRetorno;
		}

		const gravarAlteracao = async dadosRetorno => {
			if (dadosRetorno.status.codigo === 200) {
				const r = await conexao.collection('Codigos').updateOne(
					{ titulo: dadosRetorno.arquivoAlterado.titulo },
					{
						$set: {
							arquivos: dadosRetorno.arquivoAlterado.arquivos
						}
					}
				);
		
				const codigo = (r.result.ok != 1 || r.result.nModified < 1 ? 400 : 200);
				const mensagem = (codigo === 200 ? 'arquivos alterado com sucesso.' : 'nenhum arquivos alterado.');

				return retorno(codigo, mensagem);
			}
			return dadosRetorno;
		}

		// Alterar...
		const processarAlteracao = compose(then(gravarAlteracao), then(alterarArquivo(dadosCodigo && dadosCodigo.arquivos ? dadosCodigo.arquivos : [])), obterCodigo, validarParametro);
		return await processarAlteracao(dadosCodigo);
	},

})