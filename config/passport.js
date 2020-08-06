const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

function initialize(passport,pool) {
//  console.log("InitializedPassport");
  const authenticateUser = (emailaddress, password, done) => {
//    console.log('autenticateUser(',emailaddress, password,')');
    pool.query(
      `SELECT * FROM users WHERE emailaddress = $1`,
      [emailaddress],
      (err, results) => {
        if (err) {
          throw err;
        }
//        console.log(results.rows);

        if (results.rows.length > 0) {
          const user = results.rows[0];

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              console.log(err);
            }
            if (isMatch) {
              return done(null, user);
            } else {
              //password is incorrect
              return done(null, false, { message: "Пароль введен не верно/Password is incorrect" });
            }
          });
        } else {
          // No user
          return done(null, false, {
            message: "Пользоватеь с таким адресом электронной почты не зарегистрирован/No user with that email address"
          });
        }
      }
    );
  };

  passport.use('local-login',
    new LocalStrategy({
            usernameField: "emailaddress", 
            passwordField: "password"
//            passReqToCallback : true
      },
      authenticateUser
    )
  );
  // Stores user details inside session. serializeUser determines which data of the user
  // object should be stored in the session. The result of the serializeUser method is attached
  // to the session as req.session.passport.user = {}. Here for instance, it would be (as we provide
  //   the user id as the key) req.session.passport.user = {id: 'xyz'}

//  passport.serializeUser((user, done) => done(null, user.id));  

    passport.serializeUser((user, done) => done(null, {id: user.id, fullname: user.fullname, 
                                                       emailaddress: user.emailaddress, role: user.role}));
  //passport.serializeUser( (user, done) => {
  //var sessionUser = { _id: user._id, name: user.fullname, email: user.emailaddress, roles: user.role }
  //done(null, sessionUser)
  //});

  // In deserializeUser that key is matched with the in memory array / database or any data resource.
  // The fetched object is attached to the request object as req.user

  passport.deserializeUser((user, done) => {
    pool.query(`SELECT * FROM users WHERE id = $1`, [user.id], (err, results) => {
      if (err) {
        return done(err);
      }
//      console.log(`ID is ${results.rows[0].id} ${results.rows[0].fullname} ${results.rows[0].emailaddress} ${results.rows[0].role}`);
      return done(null, results.rows[0]);
    });
  });
}

module.exports = initialize;
