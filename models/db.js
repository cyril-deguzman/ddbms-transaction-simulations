const mysql = require('mysql2');

const db = {
  connection: null,

  /* Connects to a locally hosted MYSQL database */
  connect: (url) => {
    this.connection = mysql.createConnection({
      host: url,
      user: "admin",
      password: "password",
      database: "mco2"
    })

    this.connection.connect(function(err){
      if(err) throw err;
      console.log("connected to mysql central node uwu! ina mo ethel");
    })
  },

  query: (sql, callback) => {
    this.connection.query(sql, (err, result) => {
      if (err) throw err;
      console.log("Result: ", result);
      return callback(result);
    })
  },
}

module.exports = db;