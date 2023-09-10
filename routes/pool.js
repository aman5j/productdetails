var mysql = require("mysql");
var pool = mysql.createPool({
    user:'root',
    password:'1234',
    host:'127.0.0.1',
    port:3306,
    database:'productdetail',
    multipleStatements:true,
    connectionLimit:100
})

module.exports = pool;