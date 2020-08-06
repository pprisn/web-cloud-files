const express = require('express');
const { pool } = require("./config/database.js");
const bcrypt = require("bcryptjs");
const passport = require('passport')
//!!! const middleware = require('connect-ensure-login')
const flash = require("express-flash");
const session = require("express-session");

require("dotenv").config();

var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const multer  = require("multer");

const app = express();

//------------------
const bodyParser = require('body-parser')
//const expressValidator = require('express-validator');
const pgSession = require('connect-pg-simple')(session);
const morgan = require('morgan');
const winston = require('winston');

// Middleware

//Parse details from a form
app.use(express.urlencoded( { extended: false} ) );
app.set("view engine","ejs");
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
     extended: true
   }));
app.use(bodyParser.json());
app.use(session({
		store: new pgSession({
			pool
		}),
		secret: process.env.SESSION_SECRET, //config.session_secret,
		resave: false,
      saveUninitialized: false,
		cookie: { maxAge: 14 * 24 * 60 * 60 * 1000 } 
     }));


app.use(passport.initialize());
app.use(passport.session());

const initializePassport = require("./config/passport.js");
initializePassport(passport, pool);

app.use(express.static(path.join(__dirname,'public')));
//app.use(express.static(path.join(__dirname, 'public/uploads')))
//app.use(express.static(__dirname));

app.use('/static',express.static(__dirname + '/public'));



/////// multer config
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, path.join(__dirname,'public','uploads'));
    },
//    filename: (req, file, cb) =>{
//        cb(null, file.originalname);
//    }
    filename: function (req, file, cb) {
        cb(null, req.session.passport.user.id+'_'+ Date.now())
}
});

//
const fileFilter = (req, file, cb) => {
  
    if(file.mimetype === "image/png" || 
    file.mimetype === "image/jpg"|| 
    file.mimetype === "image/jpeg" ||
    file.mimetype === "application/pdf"){
        cb(null, true);
    }
    else{
        cb(null, false);
 //       return cb(new Error('Разрешено загружать только файлы форматов .png, .jpg, .jpeg и .pdf'));
    }
 }
app.use(multer({storage:storageConfig, fileFilter: fileFilter}).single("filedata"));
///////////end multer

app.use(flash())

const indexRoute = require('./routes/indexRoute.js')(passport, pool);
const filesRoute = require('./routes/filesRoute.js')(passport, pool);
app.use('/', indexRoute);
app.use('/files', filesRoute);


// more middleware (executes after routes)
//app.use(function(req, res, next) {});
// error handling middleware
//app.use(function(err, req, res, next) {});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
//  console.log(req);
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');

});

module.exports = app;
