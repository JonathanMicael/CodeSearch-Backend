const uuid = require("uuid/v4");
const { criarCampo, imutavel, validacao } = require("../lib/util");
const { pipe, replace, trim, compose, toUpper } = require("ramda");

/**
 * @module {codigos} - módulo para gerenciar os arquivos de um usuario.
 */
module.exports = {
  /**
   * Criar uma novo arquivo para o usuario.
   * @function {criar}
   *
   * @param {Object} dadosCodigo
   * @param {Object} dadosCodigo.user_id - user_id do usuario.
   * @param {string} dadosCodigo.autor - autor do arquivo.
   * @param {string} dadosCodigo.titulo - titulo do arquivo.
   * @param {string} dadosCodigo.descricao - descrição do arquivo.
   * @param {string} dadosCodigo.tecs - tecnologias do arquivo.
   * @param {string} dadosCodigo.conteudo - [opcional] conteudo do arquivo.
   *
   * @returns {Object} com dados dos arquivos do usuario e array de erros de validação: {dados: Object, erros: string[]}.
   */
  criar: function(dadosCodigo) {
    if (!dadosCodigo)
      return {
        dados: null,
        erros: ["objeto dadosCodigo inválido"]
      };

    const criarObjeto = dadosCodigo => {
      return [
        criarCampo('id', dadosCodigo.id, null, uuid(), ''),
        criarCampo("autor", dadosCodigo.autor, compose(trim), ""),
        criarCampo("titulo", dadosCodigo.titulo, compose(trim), ""),
        criarCampo("descricao", dadosCodigo.descricao, compose(trim), ""),
        criarCampo("tecs", dadosCodigo.tecs, null, []),
        criarCampo("conteudo", dadosCodigo.conteudo, compose(trim), "")
      ].reduce((ac, at) => (ac = { ...ac, ...at }), {});
    };

    const validarCampos = (dadosCodigo, erros) => {
			const d = dadosCodigo || {};
      return pipe(
        validacao.validarUUID(d.id, 'id do codigo no formato UUID V4 inválido', true),
        validacao.validarNome(d.autor,"autor do repositorio deve ter entre 2 e 250 caracteres e nem todos os especiais são aceitos",true),
        validacao.validarNome(d.titulo,"titulo do repositorio deve ter entre 2 e 250 caracteres e nem todos os especiais são aceitos",true),
        validacao.validarNome(d.descricao,"descrição do repositorio deve ter entre 2 e 250 caracteres e nem todos os especiais são aceitos",true),
        validacao.validarArray(d.tecs,"as tecnologias deve ser do tipo array separado por virgulas"),
        validacao.validarNome(d.conteudo,"conteudo do repositorio deve ter entre 2 e 250 caracteres e nem todos os especiais são aceitos",false))
        (erros)
		};

		const dados = criarObjeto(dadosCodigo);
    const erros = validarCampos(dados, []);
    
		return { dados: (erros.length > 0 ? null : imutavel(dados)), erros };
  },

  /**
   * Atualizar dados do codigo.
   * @param {Object} codigo - dados atual da codigo.
   */
  atualizar: function(codigo, valores) {
    return this.criar({ ...codigo, ...valores });
  },
};
