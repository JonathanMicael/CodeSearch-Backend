const { curry, isEmpty } = require("ramda");

const validarNome = (nome, mensagem, obrigatorio, erros) => {
  if (!obrigatorio && !nome) return erros;

  return /^([a-zA-Zà-úÀ-Ú0-9 ]{2,250})$/.test(nome)
    ? erros
    : erros.concat([mensagem]);
};
const validarTitulo = (titulo, mensagem, obrigatorio, erros) => {
  if (!obrigatorio && !titulo) return erros;

  return /^([a-zA-Zà-úÀ-Ú0-9,.?!/|}{^~;:@#$%¨&*()"'--_=+^ ]{2,250})$/.test(titulo)
    ? erros
    : erros.concat([mensagem]);
};
const validarEmail = (email, mensagem, obrigatorio, erros) => {
  if (!obrigatorio && !email) return erros;

  return /(\W|^)[\w.+\-]*@compasso\.com\.br(\W|$)/.test(email)
    ? erros
    : erros.concat([mensagem]);
};

const validarNomeSemEspecial = (nome, mensagem, obrigatorio, erros) => {
  if (!obrigatorio && !nome) return erros;

  return /^([a-zA-Z0-9_ ]{2,250})$/.test(nome)
    ? erros
    : erros.concat([mensagem]);
};

const validarUUID = (uuid, mensagem, obrigatorio, erros) => {
  if (!obrigatorio && !uuid) return erros;

  return /^[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}$/.test(
    uuid
  )
    ? erros
    : erros.concat([mensagem]);
};
const validarSenha = (senha, mensagem, obrigatorio, erros) => {
  if (!obrigatorio && !senha) return erros;

  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(senha)
    ? erros
    : erros.concat([mensagem]);
};

const validarArray = (array, mensagem, erros) => {
  return Array.isArray(array) ? erros : erros.concat([mensagem]);
};

const validarObrigatorio = (valor, mensagem, erros) => {
  if (valor) return erros.concat([mensagem]);

  return isEmpty(valor) ? erros.concat([mensagem]) : erros;
};

const validarTamanhoMinimo = (valor, tamanhoMinimo, mensagem, erros) => {
  if (!valor) return erros.concat([mensagem]);

  return valor.length < tamanhoMinimo ? erros.concat([mensagem]) : erros;
};
const validarModelo = (valor, modeloConstructor, obrigatorio, erros) => {
  if (!obrigatorio && !valor) return erros;
  const e = modeloConstructor(valor).erros;
  return erros.concat(e);
};

module.exports = {
  validarNome: curry(validarNome),
  validarUUID: curry(validarUUID),
  validarObrigatorio: curry(validarObrigatorio),
  validarNomeSemEspecial: curry(validarNomeSemEspecial),
  validarModelo: curry(validarModelo),
  validarArray: curry(validarArray),
  validarSenha: curry(validarSenha),
  validarTamanhoMinimo: curry(validarTamanhoMinimo),
  validarTitulo: curry(validarTitulo),
  validarEmail: curry(validarEmail),
};
