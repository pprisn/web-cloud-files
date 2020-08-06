const bcrypt = require('bcryptjs')
const pass = '12345678'
const saltRounds = 10 //the higher the better - the longer it takes to generate & compare
console.log(bcrypt.hashSync(pass, saltRounds))
