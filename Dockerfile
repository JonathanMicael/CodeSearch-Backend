# Imagem base
FROM node:10.16.3

# setando o diretorio de trabalho
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# variaveis
ENV PATH /usr/src/app/node_modules:$PATH

# instalando todas as dependencias e cache
ADD ./package.json /usr/src/app
RUN npm install

# startando a aplicação
CMD ["npm", "start"]