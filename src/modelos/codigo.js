const uuid = require("uuid/v4");
const codigoArquivo = require("./codigoArquivo");
const { criarCampo, imutavel, validacao } = require("../lib/util");
const { pipe, replace, trim } = require("ramda");

/**
 * @module {codigos} - módulo para gerenciar os arquivos de um usuario.
 */
module.exports = {
  /**
   * Criar uma novo arquivo para o usuario.
   * @function {criar}
   *
   * @param {Object} codigo
   * @param {Object} codigo.user_id - user_id do usuario.
   * @param {string} codigo.autor - autor do arquivo.
   * @param {string} codigo.titulo - titulo do arquivo.
   * @param {string} codigo.descricao - descrição do arquivo.
   * @param {string} codigo.tecs - tecnologias do arquivo.
   * @param {string} codigo.conteudo - [opcional] conteudo do arquivo.
   * @param {string} codigo.arquivos - [opcional] arquivos do arquivo.
   *
   * @returns {Object} com dados dos arquivos do usuario e array de erros de validação: {dados: Object, erros: string[]}.
   */
  criar: function(codigo) {
    if (!codigo)
      return {
        dados: null,
        erros: ["objeto arquivo do codigo inválido"]
      };

    const criarObjeto = codigo => {
      return [
        criarCampo('id', codigo.id, null, uuid(), ''),
        criarCampo("autor", codigo.autor, trim, ""),
        criarCampo("titulo", codigo.titulo, trim, ""),
        criarCampo("descricao", codigo.descricao, trim, ""),
        criarCampo("tecs", codigo.tecs, null, []),
        criarCampo("conteudo", codigo.conteudo, trim, ""),
        criarCampo("arquivos", codigo.arquivos, null, [])
      ].reduce((ac, at) => (ac = { ...ac, ...at }), {});
    };
    const validarCodigo = codigo => {
      const dados = codigo || {}

      const validarCampos = dados => erros => {
        const d = dados || {};
        return pipe(
          validacao.validarNome(d.autor,"autor do repositorio deve ter entre 2 e 250 caracteres e nem todos os especiais são aceitos",true),
          validacao.validarNome(d.titulo,"titulo do repositorio deve ter entre 2 e 250 caracteres e nem todos os especiais são aceitos",true),
          validacao.validarNome(d.descricao,"descrição do repositorio deve ter entre 2 e 250 caracteres e nem todos os especiais são aceitos",true),
          validacao.validarArray(d.tecs,"as tecnologias deve ser do tipo array separado por virgulas"),
         //validacao.validarNome(d.conteudo,"conteudo do repositorio deve ter entre 2 e 250 caracteres e nem todos os especiais são aceitos",true),
          validacao.validarArray(d.arquivos,"os repositorios deve ser do tipo array"))
          (erros);
      };

      const validarArquivos = dados => erros => {
        if(erros.length === 0) {
          dados.arquivos.forEach((v, i) => {
						const e = validacao.validarModelo(v, codigoArquivo.criar, true, [])
						if (e.length > 0) {
							erros = erros.concat([`entrada ${(i + 1).toString()} com erros na validação:`]).concat(e);
						}
					});
        }
        return erros;
      }

      const validar = pipe(validarCampos(dados), validarArquivos(dados))
      const erros = validar([])

      return { dados, erros }
    }

    const formatarArquivos = dadosParaFormatacao => {
      if(dadosParaFormatacao.erros.length > 0)
          return dadosParaFormatacao

      const arquivosFormatados = dadosParaFormatacao.dados.arquivos.map(v => codigoArquivo.criar(v).dados);

      return { dados: { ...dadosParaFormatacao.dados, ...{ arquivos: arquivosFormatados } }, erros: dadosParaFormatacao.erros };
    }

    // Criar....
    const criarCodigo = pipe(criarObjeto, validarCodigo, formatarArquivos)
    const retorno = criarCodigo(codigo)
    return { dados: (retorno.erros.length > 0 ? null : imutavel(retorno.dados)), erros: retorno.erros };
  },

  /**
   * Atualizar dados da codigo.
   * @param {Object} codigo - dados atual da codigo.
   */
  atualizar: function(codigo, valores) {
    return this.criar({ ...codigo, ...valores });
  },
  
	/**
	 * Atualizar arquivos do codigo.
	 * @function {atualizarArquivos}
	 * 
	 * @param {Object} codigo - dados atual do tempate
	 * @param {Object[]} arquivos - novas arquivos para substituir as anteriores.
	 * 
	 * @returns {Object} com dados do template e array de erros de validação: {dados: Object, erros: string[]}.
	 */
	atualizarArquivos: function (codigo, arquivos) {
		return this.criar({ ...codigo, ...{ arquivos } });
	},
};
