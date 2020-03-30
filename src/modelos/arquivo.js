const uuid = require("uuid/v4");
const { criarCampo, imutavel, validacao } = require("../lib/util");
const { pipe, replace, trim, compose } = require("ramda");

/**
 * @module {codigoArquivo} - módulo para gerenciar os arquivos dos codigos.
 */
module.exports = {
  /**
   * Criar um novo arquivo para o codigo.
   * @function {criar}
   *
   * @param {Object} dadosArquivo
   * @param {string} dadosArquivo.id - id do arquivo.
   * @param {string} dadosArquivo.nome - nome do arquivo.
   * @param {string} dadosArquivo.tamanho - tamanho do arquivo.
   * @param {string} dadosArquivo.chave - chave do arquivo.
   * @param {string} dadosArquivo.url - local de hospedagem do arquivo.
   *
   * @returns {Object} com dados do arquivo e array de erros de validação: {dados: Object, erros: string[]}.
   */
  criar: function(dadosArquivo) {
    if (!dadosArquivo)
      return { dados: null, erros: ["objeto dadosArquivo inválido"] };

    const criarObjeto = dadosArquivo => {
      return [
        criarCampo("id", dadosArquivo.id, null, uuid(), ""),
        criarCampo("nome", dadosArquivo.nome, null, ""),
        criarCampo("titulo", dadosArquivo.titulo, compose(trim), ""),
        criarCampo("tamanho", dadosArquivo.tamanho, null, ""),
        criarCampo("chave", dadosArquivo.chave, null, ""),
        criarCampo("url", dadosArquivo.url, null, "")
      ].reduce((ac, at) => (ac = { ...ac, ...at }), {});
    };

    const validarCampos = (dadosArquivo, erros) => {
      const d = dadosArquivo || {};
      return pipe(
        validacao.validarUUID(
          d.id,
          "id do arquivo no formato UUID V4 inválido",
          true
        ),
        validacao.validarConteudo(
          d.titulo,
          "titulo do repositorio deve ter entre 2 e 250 caracteres e nem todos os especiais são aceitos",
          true
        )
      )(erros);
    };

    const dados = criarObjeto(dadosArquivo);
    const erros = validarCampos(dados, []);

    return { dados: erros.length > 0 ? null : imutavel(dados), erros };
  },

  /**
   * Atualizar dados da arquivo.
   * @param {Object} arquivo - dados atual da arquivo.
   * @param {string} nome - nome original do arquivo.
   * @param {string} tamanho - destino do arquivo.
   * @param {string} chave - nome do arquivo.
   * @param {string} url - caminho do arquivo.
   */
  atualizar: function(arquivo, novo) {
    return this.criar({ ...arquivo, ...novo });
  }
};
