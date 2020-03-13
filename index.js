// importar servidor
require("dotenv/config");
const inicializarApp = require("./app");

const porta = process.env.PORTA || 3001;

// startar o server
inicializarApp()
  .then(server => {
    // inicializar a escuta do server
    server.listen(porta, () => {
      console.log(`CodeSearch backend está rodando na porta ${porta}`);
    });
  })
  .catch(erro => {
    console.error("Erro ao startar a Api: " + erro.message);
  });
// setar error
