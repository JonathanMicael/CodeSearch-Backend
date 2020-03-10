/**
 * Padroniza retorno das funções.
 * @module {retorno}
 * 
 * @param {number} statusCodigo - código do status de retorno para atualizar parâmetro atual.
 * @param {string} statusMensagem [opcional] - mensagem de retorno no status para atualizar parâmetro atual.
 * @param {Object} parametroAtual [opcional] - parâmetro atual.
 * @param {Object} novoObjeto [opcional] - novo objeto para inclusão no parâmetro atual.
 * @param {string[]} listaMensagens - lista de mensagens para ser inclusa na mensagem do status.
 * 
 * @returns {object} objeto de retorno atualizado: {...parametroAtual, ...{status: {codigo: number, mensagem: string}, ...novoObjeto}}
 */
module.exports = (statusCodigo, statusMensagem = '', parametroAtual = {}, novoObjeto = {}, listaMensagens = []) => {
    const mensagem = `${statusMensagem}${(listaMensagens.length > 0 ? ': ' + listaMensagens.join(' | ') : '')}`;
    return {...parametroAtual, ...{status: {codigo: statusCodigo, mensagem: mensagem}, ...novoObjeto}}
}