var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs')
/* return route home page. */
const winston = require('winston')
module.exports = (passport, pool) => {

var auth  = require('../controllers/authController')

router.get("/", (req, res) => {
  // console.log(req)
  res.render("index.ejs",{title: "CloudFiles"});
});

router.get("/users/register", auth.LoggedIn, (req, res, next) => {
 let errors = [];
  // console.log("GET /users/register CHECK auth.LoggedIn")
  errors.push({message: "Вам требуется зарегистрироваться в ситеме/You must register in system" });
  res.render("register.ejs", {errors});
});

router.get("/users/login", auth.LoggedIn, (req, res, next) => {
  let errors = [];
//  console.log("GET /users/login CHECK auth.LoggedIn")
  // flash sets a messages variable. passport sets the error message
  errors.push({message: "Вам требуется войти в ситему/You must log in system"}); 
  res.render("login.ejs", { errors });
});

router.get("/users/logout", (req, res) => {
  req.logout();
  res.render("index", { message: "Вы успешно вышли из системы/You have logged out successfully" });
});

router.post("/users/register", async (req, res) => {
  let { fullname, emailaddress, password, password2, city, country } = req.body;
  let errors = [];
//  console.log({
//    fullname,
//    emailaddress,
//    password,
//    password2,
//    city,
//    country
//  });

 if (!fullname || !emailaddress || !password || !password2) {
    errors.push({ message: "Пожалуйста заполните все поля/Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Пароль должен быть больше 6 символов/Password must be a least 6 characters long" });
  }

  if (password !== password2) {
    errors.push({ message: "Пароль не совпадает/Passwords do not match" });
  }

  if (errors.length > 0) {
    res.render("register", { errors, fullname, emailaddress, password, password2,city,country });
  } else {
    hashedPassword = await bcrypt.hash(password, 8);
//    console.log(hashedPassword);
    // Validation passed
    pool.query(
      `SELECT * FROM users
        WHERE emailaddress = $1`,
      [emailaddress],
      (err, results) => {
        if (err) {
          console.log(err);
        }
//        console.log(results.rows);
        if (results.rows.length > 0) {
          return res.render("register", {
            message: "Email already registered"
          });
        } else {
            var sql = 'INSERT INTO users (fullname, emailaddress, password, city, country, created_at ) VALUES($1, $2, $3, $4, $5, NOW()) RETURNING id, password'; 
            pool.query(sql,
            [fullname, emailaddress, hashedPassword,city,country],
            (err, results) => {
              if (err) {
                throw err;
              }
//              console.log(results.rows);
              req.flash("success_msg", "Вы зарегистрированы. Перейдите на страницу входа в систему/log in");
              res.redirect("/users/login");
            }
          );
        }
      }
    );
  }
});

router.post(
  "/users/login",passport.authenticate("local-login", 
          { successRedirect: '/files/dashboard',
            failureRedirect: '/users/login',
            failureFlash: true }) 
);

//---function move in authController
function LoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/files/dashboard");
  }
  next();
i}
function LoggedOut(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users/login");
}
//-------- move in authController

return router;
}

