const { curry, isEmpty } = require("ramda");

const validarNome = (nome, mensagem, obrigatorio, erros) => {
  if (!obrigatorio && !nome) return erros;

  return /^([a-zA-Zà-úÀ-Ú0-9 ]{2,250})$/.test(nome)
    ? erros
    : erros.concat([mensagem]);
};

const validarNomeSemEspecial = (nome, mensagem, obrigatorio, erros) => {
  if (!obrigatorio && !nome) return erros;

  return /^([a-zA-Z0-9_ ]{2,250})$/.test(nome)
    ? erros
    : erros.concat([mensagem]);
};

const validarIdentificacao = (identificacao, mensagem, obrigatorio, erros) => {
  if (!obrigatorio && !identificacao) return erros;

  return /^[a-zA-Z0-9]{2,20}$/.test(identificacao)
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

const removerCaracterEspecial = str => str.replace(/\D/g, "");
const calcularDigitoVerificadorCnpjCpf = (pesos, parteCnpj) => {
  const soma = (pesos, parteCnpj) =>
    parteCnpj.reduce((ac, at, i) => (ac = ac + at * pesos[i]), 0);
  const resultadoSoma = soma(pesos, parteCnpj);
  return resultadoSoma % 11 < 2 ? 0 : 11 - (resultadoSoma % 11);
};
const validarFormatoCnpjCpf = cnpjCpf =>
  /[0-9]{11}/.test(cnpjCpf) || /[0-9]{14}/.test(cnpjCpf);

const validarCnpjCpf = (cnpjCpf, mensagem, obrigatorio, erros) => {
  if (!obrigatorio && !cnpjCpf) return erros;

  const cnpjsInvalidos = [
    "00000000000000",
    "11111111111111",
    "22222222222222",
    "33333333333333",
    "44444444444444",
    "55555555555555",
    "66666666666666",
    "77777777777777",
    "88888888888888",
    "99999999999999"
  ];
  const cpfsInvalidos = [
    "00000000000",
    "11111111111",
    "22222222222",
    "33333333333",
    "44444444444",
    "55555555555",
    "66666666666",
    "77777777777",
    "88888888888",
    "99999999999"
  ];

  const formatado = removerCaracterEspecial(cnpjCpf);

  if (
    !validarFormatoCnpjCpf(formatado) ||
    cnpjsInvalidos.includes(formatado) ||
    cpfsInvalidos.includes(formatado)
  )
    return erros.concat([mensagem]);

  const pesos1 =
    formatado.length === 14
      ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
      : [10, 9, 8, 7, 6, 5, 4, 3, 2];
  const pesos2 =
    formatado.length === 14
      ? [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
      : [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
  const numeroCarecteresParaCalculo = formatado.length === 14 ? 12 : 9;

  const numeros = formatado.split("").map(v => parseInt(v));
  const digitos = numeros.slice(-2);

  const digito1 = calcularDigitoVerificadorCnpjCpf(
    pesos1,
    numeros.slice(0, numeroCarecteresParaCalculo)
  );
  const digito2 = calcularDigitoVerificadorCnpjCpf(
    pesos2,
    numeros.slice(0, numeroCarecteresParaCalculo).concat(digito1)
  );

  return digito1 === digitos[0] && digito2 === digitos[1]
    ? erros
    : erros.concat([mensagem]);
};

const validarObrigatorio = (valor, mensagem, erros) => {
  if (valor) return erros.concat([mensagem]);

  return isEmpty(valor) ? erros.concat([mensagem]) : erros;
};

const validarUF = (uf, mensagem, obrigatorio, erros) => {
  if (!obrigatorio && !uf) return erros;
  if (uf.length != 2) return erros.concat([mensagem]);

  const ufs = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO"
  ];
  return ufs.includes(uf) ? erros : erros.concat([mensagem]);
};

const validarModelo = (valor, modeloConstructor, obrigatorio, erros) => {
  if (!obrigatorio && !valor) return erros;
  const e = modeloConstructor(valor).erros;
  return erros.concat(e);
};

module.exports = {
  validarNome: curry(validarNome),
  validarIdentificacao: curry(validarIdentificacao),
  validarUUID: curry(validarUUID),
  validarObrigatorio: curry(validarObrigatorio),
  validarCnpjCpf: curry(validarCnpjCpf),
  validarUF: curry(validarUF),
  validarNomeSemEspecial: curry(validarNomeSemEspecial),
  validarModelo: curry(validarModelo),
  validarArray: curry(validarArray),
  validarSenha: curry(validarSenha)
};
