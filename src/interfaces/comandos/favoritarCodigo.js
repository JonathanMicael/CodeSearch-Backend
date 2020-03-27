const { codigo } = require("../../modelos");
const { processamento, retorno } = require("../../lib/util");

/**
 * @module {inserirFavorito} - comando para favoritar um codigo.
 * @param {repositorioCodigo} repositorioCodigo - repositório do codigo.
 */
module.exports = repositorioCodigo => ({
  /**
   * Executar o comando para favoritar um codigo.
   * @function {executar} - função obrigatório (interface) para todos os comandos.
   *
   * @param {Object} parametro
   * @param {string} parametro.usuario_id - id do usuario.
   * @param {string} parametro.codigo_id - id do codigo.
   *
   * @returns {Object}  {status: {codigo: number, mensagem: string}}.
   */
  executar: async function(parametro) {
    const p = processamento(
      this.validarParametro,
      this.obterCodigo,
      this.gerarCodigo,
      this.inserirFavorito
    );
    const r = await p(parametro);

    return retorno(r.status.codigo, r.status.mensagem, r);
  },

  /**
   * Validar parâmetro
   * @function {validarParametro}
   *
   * @param {Object} parametro - parâmetro passado para execução do comando.
   *
   * @returns {Object} {status: {codigo: number, mensagem: string}, ...parametro}.
   */
  validarParametro: function(parametro) {
    if (!parametro || !parametro.usuario_id || !parametro.codigo_id)
      return retorno(
        400,
        "parâmetro inválido: { usuario_id: string, codigo_id: string }"
      );

    return retorno(200, "parâmetro válido.", {}, { dadosFavorito: parametro });
  },
  /**
   * Obter um codigo com os dados.
   * @function {obterCodigo}
   *
   * @param {Object} dadosRetorno
   * @param {Object} dadosRetorno.dadosFavorito - objeto com informações do usuario e codigo para favoritar.
   *
   * @returns {Object} {status: {codigo: number, mensagem: string}, ...dadosRetorno, logar: Object}.
   */
  obterCodigo: async function(dadosRetorno) {
    const dadosCodigo = await repositorioCodigo.obter({
      id: dadosRetorno.dadosFavorito.codigo_id
    });

    if (dadosCodigo.codigo)
      return retorno(200, "codigo recuperado.", dadosRetorno, {
        codigo: dadosCodigo.codigo
      });

    return retorno(
      400,
      "os dados para recuperar o codigo estão inconsistentes",
      dadosRetorno,
      {},
      dadosCodigo.erros
    );
  },
  /**
   * Formatar objeto com dados do codigo obtidos.
   * @function {gerarCodigo}
   *
   * @param {Object} dadosRetorno
   * @param {Object} dadosRetorno.dadosFavorito - objeto com informações do codigo para favoritar.
   * @param {Object} dadosRetorno.codigo - objeto com informações do codigo para favoritar.
   *
   * @returns {Object} {status: {codigo: number, mensagem: string}, ...dadosRetorno, codigo: Object}.
   */
  gerarCodigo: function(dadosRetorno) {
    const favoritos = dadosRetorno.codigo.favoritos;
    const usuario = dadosRetorno.dadosFavorito.usuario_id;

    if (favoritos.includes(usuario))
      return retorno(
        400,
        "o usuario já está favoritado nesse codigo",
        dadosRetorno
      );

    const codigoAtualizado = codigo.atualizar(dadosRetorno.codigo, {
      favoritos: [...favoritos, usuario]
    });

    if (codigoAtualizado.dados)
      return retorno(200, "codigo favoritado com sucesso.", dadosRetorno, {
        favoritar: codigoAtualizado.dados
      });

    return retorno(
      400,
      "os dados para recuperar o codigo estão inconsistentes",
      dadosRetorno,
      {},
      codigoAtualizado.erros
    );
  },
  /**
   * Persistir o codigo.
   * @function {inserirFavorito}
   *
   * @param {Object} dadosRetorno
   * @param {Object} dadosRetorno.codigo - codigo gerado e validado para gravação.
   *
   * @returns {Object} {status: {codigo: number, mensagem: string}, ...dadosRetorno}.
   */
  inserirFavorito: async function(dadosRetorno) {
    if (dadosRetorno.status.codigo === 200) {
      const r = await repositorioCodigo.gravar(dadosRetorno.favoritar);
      return retorno(r.status.codigo, r.status.mensagem, dadosRetorno);
    }
    return dadosRetorno;
  }
});
