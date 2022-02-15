const mysql = require('mysql');

const db_left = {
  connection: null,
  state: false,

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
      this.state = true;
      console.log("connected to mysql central node uwu!");
    })
  },

  query: (sql, callback) => {
    this.connection.query(sql, (err, result) => {
      if (err) throw err;
      console.log("Result: ", result);
      return callback(result);
    })
  },

  autoCommit: (val, callback) => {
    const query = `SET autocommit = ${val};`
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

  close: (callback) => {
    this.connection.end((err, result) => {
      if(err) throw err;
      console.log("connection: successfully closed left node");
      this.state = false;
      return callback(result);
    });
  }
}

module.exports = db_left;