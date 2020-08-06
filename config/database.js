
require("dotenv").config({path: __dirname +'/../.env'});

//console.log(require('dotenv').config( {path: __dirname +'/../.env'} ) )

if (process.env.DB_TYPE == 'postgres') {
  const { Pool } = require("pg");

  const isProduction = process.env.NODE_ENV === "production";
  const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

  const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
    ssl: isProduction,
    max: process.env.DB_MAXPOOL,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

//  console.log(pool)
  module.exports = { pool };
}

if (process.env.DB_TYPE == "mysql") {
  var mysql = require('mysql2');
  
  const pool = mysql.createPool({
    connectionLimit: process.env.DB_MAXPOOL,
    host: process.env.DB_HOST, // Replace with your host name
    user: process.env.DB_USER,      // Replace with your database username
    password: process.env.DB_PASSWORD,      // Replace with your database password
    database: process.env.DB_DATABASE // // Replace with your database Name

  });
  
// var conn = mysql.createConnection({
//   host: process.env.DB_HOST, // Replace with your host name
//    user: process.env.DB_USER,      // Replace with your database username
//    password: process.env.DB_PASSWORD,      // Replace with your database password
//    database: process.env.DB_DATABASE // // Replace with your database Name
//  }); 
//  conn.connect(function(err) {
//    if (err) throw err;
//    console.log('Database is connected successfully !');
//  });
//  module.exports = conn;



 // pool.end(function(err) {
 //   if (err) {
 //     console.log(err.message);
 //   }
 //   console.log("пул закрыт");
 // });

  module.exports = { pool };

}
