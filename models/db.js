const mysql = require('mysql');

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
      db.autoCommit((result) => {})
    })
  },

  query: (sql, callback) => {
    this.connection.query(sql, (err, result) => {
      if (err) throw err;
      console.log("Result: ", result);
      return callback(result);
    })
  },

  autoCommit: (callback) => {
    const query = `SET autocommit = 0;`
    this.connection.query(query, (err, result) => {
      if (err) throw err;
      console.log("Result: ", result);
      return callback(result);
    })
  },

  startTransaction: (callback) => {
    const query = `START TRANSACTION;`
    this.connection.query(query, (err, result) => {
      if (err) throw err;
      console.log("Result: ", result);
      return callback(result);
    })
  },

  commit: (callback) => {
    const query = `COMMIT;`
    this.connection.query(query, (err, result) => {
      if (err) throw err;
      console.log("Result: ", result);
      return callback(result);
    })
  },

  rollback: () => {
    const query = `ROLLBACK;`
    this.connection.query(query, (err, result) => {
      if (err) throw err;
      console.log("Result: ", result);
      return callback(result);
    })
  }
}

module.exports = db;