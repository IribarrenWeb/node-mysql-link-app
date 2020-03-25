const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const helpers = require("../lib/helpers");
const db = require("../database");

passport.use(
  "locale.login",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true
    },
    async (req, username, password, done) => {
      try {
        const user = await db.query("SELECT * FROM user WHERE username = ?", [
          username
        ]);
        if (typeof user[0].id != "undefined") {
          let validation = await helpers.match(password, user[0].password)
          if (validation) {
            done(null, user[0], req.flash("success", "Welcome in"));
          } else {
            done(null, false, req.flash("error", "The password is incorrect"));
          }
        } else {
          console.log("fail bebe");
          done(null, false, req.flash("error", "No user doesnt exist in the sistem"));
        }
      } catch (error) {
          done(null,false,req.flash('error', 'Error with the data'))
      }
    }
  )
);

passport.use(
  "locale",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true
    },
    async (req, username, password, done) => {
      let { name, lastname } = req.body;
      const newUser = {
        username,
        name,
        password,
        lastname
      };
      newUser.password = await helpers.hash(password);

      try {
        let response = await db.query("INSERT INTO user SET ?", [newUser]);
        if (response.affectedRows === 1) {
          // console.log('ADENTRO BEBE')
          // req.flash('success', 'The user was create successfully')
          newUser.id = response.insertId;
          return done(null, newUser);
        } else {
          // req.flash('error', 'The user was not create')
          return done("Error", null);
        }
      } catch (error) {
        return done(error, null);
        // req.flash('error', 'Error in the server')
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await db.query("SELECT * FROM user WHERE id = ?", [id]);
  done(null, rows[0]);
});

module.exports = passport;
