const { compose, then } = require('ramda');
const { codigo } = require('../../../modelos');
const { retorno } = require('../../../lib/util');

/**
 * @module {repositorioCodigo} - módulo para persistência e recuperação do codigo.
 * @param {Object} conexao - objeto de conexao com o MongoDB.
 */
module.exports = conexao => ({
  /**
	 * Obtém codigo pelo titulo.
	 * @function {obter}
	 * 
	 * @param {Object} dadosCodigo
	 * @param {string} dadosCodigo.titulo - titulo do codigo para busca.
	 * 
	 * @returns {object} {status: {codigo: number, mensagem: string}, codigo: Object}.
	 */
  obter: async function(dadosCodigo) {
    const validarParametros = (dadosCodigo) => {
      if(!dadosCodigo || !dadosCodigo.id) 
         return retorno(400, 'dados do codigo inválido: {id: string}')

        return retorno(200, '', {}, {dadosCodigo})
    }

    const recuperarCodigo = async (dadosRetorno) => {
      if(dadosRetorno.status.codigo === 200) {
				const r = await conexao.collection('Codigos').findOne({
          $or: [
            { id: dadosRetorno.dadosCodigo.id },
            { titulo: dadosRetorno.dadosCodigo.titulo }
          ]
        });
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
	 * Insere um novo codigo ou altera um codigo existente.
	 * @function {gravar}
	 * 
	 * @param {string} dadosCodigo.id [opcional] - id do codigo.
	 * @param {string} dadosCodigo.titulo - titulo do codigo.
	 * @param {string} dadosCodigo.autor - identificação do codigo.
	 * @param {string} dadosCodigo.descricao - CNPJ ou CPF do codigo.
	 * @param {string} dadosCodigo.conteudo - cidade do codigo.
	 * 
	 * @returns {Object} { status: {codigo: number, mensagem: string }}
	 */
	gravar: async function (dadosCodigo) {

		const validarCodigo = dadosCodigo => codigo.criar(dadosCodigo);
	
		const inserirCodigo = async (dadosCodigo) => {
			try {
				await conexao.collection('Codigos').insertOne({ ...dadosCodigo });
				return retorno(201, 'codigo incluso com sucesso.');
			}
			catch (err) {
				console.error('[ERRO]','[servicos.repositorios.mongo.repositorioCodigo.gravar.inserirCodigo]', `[${err.message}]`, err);
				return retorno(500, 'erro interno ao inserir o codigo');
			}
		};
	
		const alterarCodigo = async (dadosCodigo) => {
			const r = await conexao.collection('Codigos').updateOne(
				{ id: dadosCodigo.id },
				{
					$set: {
						autor: dadosCodigo.autor,
						titulo: dadosCodigo.titulo,
						descricao: dadosCodigo.descricao,
						tecs: dadosCodigo.tecs,
						conteudo: dadosCodigo.conteudo
					}
				}
			);
	
			const codigo = (r.result.ok != 1 || r.result.nModified < 1 ? 404 : 200);
			const mensagem = (codigo === 200 ? 'codigo alterado com sucesso.' : 'nenhum codigo alterado.');

			return retorno(codigo, mensagem);
		};
	
		const gravarCodigo = async (retornoCodigo) => {
			if (retornoCodigo.dados) {
				const r = await this.obter(retornoCodigo.dados);
				if (![200, 404].includes(r.status.codigo))
					return r;

				return r.status.codigo === 200
					? await alterarCodigo({ ...retornoCodigo.dados })
					: await inserirCodigo({ ...retornoCodigo.dados })
			}
			else {
				return retorno(400, 'dados inconsistentes no codigo', {}, {}, retornoCodigo.erros);
			}
		};

		// Processar...
		const processarGravar = compose(gravarCodigo, validarCodigo);

		return await processarGravar(dadosCodigo);
	},
	/**
	 * Apagar um codigo pelo id.
	 * @function {apagar}
	 * 
	 * @param {Object} dadosCodigo - dados do codigo para apagar.
	 * @param {string} dadosCodigo.id - id do codigo.
	 * 
	 * @returns {Object} {status: {codigo: number, mensagem: string}}.
	 */
	apagar: async function (dadosCodigo) {
		const validarParametro = (dadosCodigo) => {
			if (!dadosCodigo || typeof dadosCodigo.id == 'undefined')
				return retorno(400, 'dados do codigo inválida: {id: string}');
			return retorno(200, '', {}, { dadosCodigo });
		};

		const apagarCodigo = async (dadosRetorno) => {
			if (dadosRetorno.status.codigo === 200) {
				const r = await conexao.collection('Codigos').deleteOne({
					id: dadosRetorno.dadosCodigo.id
				});
				if (r.deletedCount > 0)
					return retorno(200, 'codigo apagado.');
				return retorno(404, 'codigo não encontrado.');
			}
			return dadosRetorno;
		};

		const processarApagar = compose(apagarCodigo, validarParametro);
		return await processarApagar(dadosCodigo);
	},
})