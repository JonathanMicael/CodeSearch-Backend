const { Strategy, ExtractJwt } = require("passport-jwt");
const passport = require("passport");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET || "secret"
};

module.exports = async conexao => {
  passport.use(
    new Strategy(opts, async (payload, done) => {
      await conexao
        .collection("Usuarios")
        .findById(payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => {
          return done(null, false);
        });
    })
  );

  return conexao;
};
