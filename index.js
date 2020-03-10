// importar servidor
require("dotenv/config");
const inicializarApp = require("./app");

// startar o server
inicializarApp()
  .then(server => {
    // inicializar a escuta do server
    server.listen(3001, () => {
      console.log(
        "CodeSearch backend está rodando na porta http://localhost:3001"
      );
    });
  })
  .catch(erro => {
    console.error("Erro ao startar a Api: " + erro.message);
  });
// setar error
