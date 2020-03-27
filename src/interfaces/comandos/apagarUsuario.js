const { processamento, retorno } = require("../../lib/util");

/**
 * @module {apagarUsuario} - comando para apagar um usuario.
 * @param {repositorioUsuario} repositorioUsuario - repositório de usuario.
 */
module.exports = repositorioUsuario => ({
  /**
   * Executar o comando para apagar um usuario.
   * @function {executar} - função obrigatório (interface) para todos os comandos.
   * @param {Object} parametro
   * @param {Object} parametro.id - id do usuario a ser buscado.
   * @param {Object} parametro.usuario_id - usuario_id do usuario a ser buscado.
   * @param {Object} parametro.permissoes - permissoes do usuario a ser deletado.
   * @returns {object} retorna mensagem de sucesso.
   */
  executar: async function(parametro) {
    const p = processamento(this.validarParametro,this.obterUsuario, this.apagarUsuario);
    const r = await p(parametro);
    return retorno(r.status.codigo, r.status.mensagem, {}, { dados: r.codigo });
  },
  /**
   * Validar parâmetro
   * @function {validarParametro}
   * @param {Object} dados
   * @param {Object} dados.dadosUsuario - objeto com informações da configuração para obter.
   * @returns {Object} {status: {codigo: number, mensagem: string}, ...dados}.
   */
  validarParametro: function(parametro) {
    if (!parametro || typeof parametro.id === "undefined" || typeof parametro.usuario_id === "undefined")
      return retorno(400, "parâmetro inválido: {id: string, usuario_id: string}");

    return retorno(
      200,
      "parâmetro válido.",
      {},
      { dadosUsuario:  parametro }
    );
  },
   /**
   * Obter um usuario com os dados.
   * @function {obterCodigo}
   *
   * @param {Object} dadosRetorno
   * @param {Object} dadosRetorno.dadosUsuario - objeto com informações do usuario.
   *
   * @returns {Object} {status: {codigo: number, mensagem: string}, ...dadosRetorno, usuario: Object}.
   */
  obterUsuario: async function (dadosRetorno) {
      if(dadosRetorno.dadosUsuario.permissoes.includes('editor'))
        return retorno(401, 'o usuario não possui permissão para a exclusão do usuario.', dadosRetorno)

      if(dadosRetorno.dadosUsuario.id !== dadosRetorno.dadosUsuario.usuario_id) {
        const usuario = await repositorioUsuario.obter({id: dadosRetorno.dadosUsuario.id })
          if(usuario.status.codigo !== 200)
            return retorno(401, 'o usuario a ser deletado nao está cadastrado.', dadosRetorno)
            
            if(!dadosRetorno.dadosUsuario.permissoes.includes('admin'))
            return retorno(401, 'o usuario nao tem permissão para ser deletado', dadosRetorno)

        const usuarioApagarAdmin = await repositorioUsuario.obter({id: dadosRetorno.dadosUsuario.id })

        if(usuarioApagarAdmin.usuario)
            return retorno(200, 'o usuario a ser apagado por admin foi obtido com sucesso.', dadosRetorno, usuarioApagarAdmin)

        return retorno(400,"os dados para recuperar o codigo estão inconsistentes",dadosRetorno,{}, usuarioApagarAdmin.erros);
      }

      const usuarioApagar = await repositorioUsuario.obter({id: dadosRetorno.dadosUsuario.id })
        if(usuarioApagar.usuario)
          return retorno(200, 'o usuario a ser apagado foi obtido com sucesso.', dadosRetorno, usuarioApagar)
    
      return retorno(400,"os dados para recuperar o codigo estão inconsistentes",dadosRetorno,{},usuarioApagar.erros);
  },
  /**
   * Apagar o usuario.
   * @function {apagarUsuario}
   * @param {Object} dadosRetorno
   * @param {Object} dadosRetorno.dadosUsuario
   * @param {string} dadosRetorno.dadosUsuario.id - id do codigo.
   * @returns {Object} {status: {codigo: number, mensagem: string}, ...parametro, usuario: Object}.
   */
  apagarUsuario: async function(dadosRetorno) {
    if (dadosRetorno.status.codigo === 200) {
      const r = await repositorioUsuario.apagar(dadosRetorno.dadosUsuario);
      return retorno(r.status.codigo, r.status.mensagem);
    }
    return dadosRetorno;
  }
});
