const { criarCampo, imutavel, validacao } = require("../lib/util");
const { pipe, replace, trim } = require("ramda");

/**
 * @module {codigoArquivo} - módulo para gerenciar os arquivos dos codigos.
 */
module.exports = {
  /**
   * Criar um novo arquivo para o codigo.
   * @function {criar}
   *
   * @param {Object} arquivo
   * @param {string} arquivo.titulo - chave da arquivo.
   * @param {string} arquivo.path - valor padrão da arquivo.
   * @param {string} arquivo.tipo - tipo da arquivo.
   *
   * @returns {Object} com dados do arquivo do codigo e array de erros de validação: {dados: Object, erros: string[]}.
   */
  criar: function(arquivo) {
    if (!arquivo)
      return { dados: null, erros: ["objeto arquivo do codigo inválido"] };

    const criarObjeto = arquivo => {
      return [
        criarCampo("originalname", arquivo.originalname, null, ""),
        criarCampo("destination", arquivo.destination, null, ""),
        criarCampo("filename", arquivo.filename, null, ""),
        criarCampo("path", arquivo.path, null, ""),
        criarCampo("size", arquivo.size, null, "")
      ].reduce((ac, at) => (ac = { ...ac, ...at }), {});
    };

    const dados = criarObjeto(arquivo);
    const erros = []

    return { dados: erros.length > 0 ? null : imutavel(dados), erros };
  },

  /**
   * Atualizar dados da arquivo.
   * @param {Object} arquivo - dados atual da arquivo.
   * @param {string} titulo - titulo padrão da arquivo.
   * @param {string} path - path do arquivo.
   * @param {string} tipo - tipo do arquivo.
   */
  atualizar: function(arquivo, path, tipo) {
    return this.criar({ ...arquivo, ...{ path, tipo } });
  }
};
