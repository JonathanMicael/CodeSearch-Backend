const { compose, then } = require("ramda");
const { arquivo } = require("../../../modelos");
const { retorno } = require("../../../lib/util");
const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
/**
 * @module {repositorioArquivo} - módulo para persistência e recuperação do arquivo.
 * @param {Object} conexao - objeto de conexao com o MongoDB.
 */
module.exports = conexao => ({
  /**
   * Obtém arquivo pelo titulo.
   * @function {obter}
   *
   * @param {Object} dadosArquivo
   * @param {string} dadosArquivo.id - id do arquivo para busca.
   *
   * @returns {object} {status: {codigo: number, mensagem: string}, arquivo: Object}.
   */
  obter: async function(dadosArquivo) {
    const validarParametros = dadosArquivo => {
      if (!dadosArquivo || !dadosArquivo.titulo)
        return retorno(400, "dados do arquivo inválido: {titulo: string}");

      return retorno(200, "", {}, { dadosArquivo });
    };

    const recuperarArquivo = async dadosRetorno => {
      if (dadosRetorno.status.codigo === 200) {
        const r = await conexao.collection("Arquivos").findOne({
          $or: [
            { id: dadosRetorno.dadosArquivo.id },
            { titulo: dadosRetorno.dadosArquivo.titulo }
          ]
        });
        if (r) {
          const ac = await arquivo.criar(r);
          if (ac.dados)
            return retorno(
              200,
              "arquivos recuperados com sucesso.",
              {},
              { arquivo: ac.dados }
            );
          else
            return retorno(
              400,
              "arquivo com dados inconsistentes.",
              {},
              {},
              ac.erros
            );
        }
        return retorno(404, "arquivos nao encontrados.");
      }
      return dadosRetorno;
    };
    // Processar ....
    const processarObter = compose(recuperarArquivo, validarParametros);
    return await processarObter(dadosArquivo);
  },
  /**
   * Insere um novo arquivo ou altera um arquivo existente.
   * @function {gravar}
   *
   * @param {string} dadosArquivo.id [opcional] - id do arquivo.
   * @param {string} dadosArquivo.nome - nome do arquivo.
   * @param {string} dadosArquivo.tamanho - tamanho do arquivo.
   * @param {string} dadosArquivo.chave - chave do arquivo.
   * @param {string} dadosArquivo.url - url do arquivo.
   *
   * @returns {Object} { status: {codigo: number, mensagem: string }}
   */
  gravar: async function(dadosArquivo) {
    const validarArquivo = dadosArquivo => arquivo.criar(dadosArquivo);

    const inserirArquivo = async dadosArquivo => {
      try {
        await conexao.collection("Arquivos").insertOne({
          ...dadosArquivo,
          url:
            process.env.AMBIENTE === "prod"
              ? `http://localhost:3001/files/${dadosArquivo.chave}`
              : `http://localhost:3001/files/${dadosArquivo.chave}`
        });
        return retorno(201, "arquivo incluso com sucesso.");
      } catch (err) {
        console.error(
          "[ERRO]",
          "[servicos.repositorios.mongo.repositorioArquivo.gravar.inserirArquivo]",
          `[${err.message}]`,
          err
        );
        return retorno(500, "erro interno ao inserir o arquivo");
      }
    };

    const alterarArquivo = async dadosArquivo => {
      const r = await conexao.collection("Arquivos").updateOne(
        { id: dadosArquivo.id },
        {
          $set: {
            nome: dadosArquivo.nome,
            tamanho: dadosArquivo.tamanho,
            chave: dadosArquivo.chave,
            url:
              process.env.AMBIENTE === "prod"
                ? `http://localhost:3001/files/${dadosArquivo.chave}`
                : `http://localhost:3001/files/${dadosArquivo.chave}`
          }
        }
      );
      const codigo = r.result.ok != 1 || r.result.nModified < 1 ? 404 : 200;
      const mensagem =
        codigo === 200
          ? "arquivo alterado com sucesso."
          : "nenhum arquivo alterado.";
      return retorno(codigo, mensagem);
    };

    const gravarArquivo = async retornoArquivo => {
      if (retornoArquivo.dados) {
        const r = await this.obter(retornoArquivo.dados);
        if (![200, 404].includes(r.status.codigo)) return r;

        return r.status.codigo === 200
          ? await alterarArquivo({ ...retornoArquivo.dados })
          : await inserirArquivo({ ...retornoArquivo.dados });
      } else {
        return retorno(
          400,
          "dados inconsistentes no arquivo",
          {},
          {},
          retornoArquivo.erros
        );
      }
    };

    // Processar...
    const processarGravar = compose(gravarArquivo, validarArquivo);

    return await processarGravar(dadosArquivo);
  },
  /**
   * Alterar um arquivo.
   * @function {alterarArquivo}
   *
   * @param {Object} dadosArquivo - dados do arquivo para alteração
   * @param {string} dadosArquivo.id - id do arquivo.
   * @param {string} dadosArquivo.nome - nova descrição para alteração.
   * @param {string} dadosArquivo.tamanho - nova descrição para alteração.
   * @param {string} dadosArquivo.chave - nova descrição para alteração.
   * @param {string} dadosArquivo.url - nova descrição para alteração.
   *
   * @returns {Object} { status: {codigo: number, mensagem: string }}
   */
  alterarArquivo: async function(dadosArquivo) {
    const validarParametro = dadosArquivo => {
      if (
        !dadosArquivo ||
        !dadosArquivo.id ||
        !dadosArquivo.nome ||
        !dadosArquivo.tamanho ||
        !dadosArquivo.chave ||
        !dadosArquivo.url
      )
        return retorno(
          400,
          "dados do arquivo inválido para alteração: {id: string, nome: string, tamanho: string, chave: string, url: string}"
        );

      return retorno(200, "", {}, { dadosArquivo });
    };

    const obterArquivo = async dadosRetorno => {
      if (dadosRetorno.status.codigo === 200)
        return await this.obter(dadosRetorno.dadosArquivo);

      return dadosRetorno;
    };

    const alterarArquivo = dadosArquivo => dadosRetorno => {
      if (dadosRetorno.status.codigo === 200) {
        const r = arquivo.atualizar(dadosRetorno.arquivo, dadosArquivo);
        if (r.erros.length > 0)
          return retorno(
            400,
            "dados inconsistentes para atualizar o arquivo",
            {},
            {},
            r.erros
          );
        return retorno(
          200,
          "Arquivo alterado",
          {},
          { arquivoAlterado: r.dados }
        );
      }
      return dadosRetorno;
    };

    const gravarAlteracao = async dadosRetorno => {
      if (dadosRetorno.status.codigo === 200) {
        const r = await conexao.collection("Arquivos").updateOne(
          { id: dadosRetorno.arquivoAlterado.id },
          {
            $set: {
              nome: dadosRetorno.arquivoAlterado.nome,
              tamanho: dadosRetorno.arquivoAlterado.tamanho,
              chave: dadosRetorno.arquivoAlterado.chave,
              url:
                process.env.AMBIENTE === "prod"
                  ? `${process.env.URL}/files/${dadosRetorno.arquivoAlterado.chave}`
                  : `http://localhost:3001/files/${dadosRetorno.arquivoAlterado.chave}`
            }
          }
        );

        const codigo = r.result.ok != 1 || r.result.nModified < 1 ? 400 : 200;
        const mensagem =
          codigo === 200
            ? "arquivo alterado com sucesso."
            : "nenhum arquivo alterado.";

        return retorno(codigo, mensagem);
      }
      return dadosRetorno;
    };

    // Alterar...
    const processarAlteracao = compose(
      then(gravarAlteracao),
      then(alterarArquivo(dadosArquivo)),
      obterArquivo,
      validarParametro
    );
    return await processarAlteracao(dadosArquivo);
  },
  /**
   * Apagar um arquivo pelo id.
   * @function {apagar}
   *
   * @param {Object} dadosArquivo - dados do arquivo para apagar.
   * @param {string} dadosArquivo.id - id do codigo.
   *
   * @returns {Object} {status: {codigo: number, mensagem: string}}.
   */
  apagar: async function(dadosArquivo) {
    const validarParametro = dadosArquivo => {
      if (!dadosArquivo || typeof dadosArquivo.id == "undefined")
        return retorno(400, "dados do arquivo inválida: {id: string}");
      return retorno(200, "", {}, { dadosArquivo });
    };

    const apagarArquivo = async dadosRetorno => {
      if (dadosRetorno.status.codigo === 200) {
        const r = await conexao.collection("Arquivos").deleteOne({
          id: dadosRetorno.dadosArquivo.id
        });
        if (r.deletedCount > 0) return retorno(200, "arquivo apagado.");
        return retorno(404, "arquivo não encontrado.");
      }
      return dadosRetorno;
    };

    const processarApagar = compose(apagarArquivo, validarParametro);
    return await processarApagar(dadosArquivo);
  }
});
