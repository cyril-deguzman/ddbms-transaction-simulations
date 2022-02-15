const mysql = require('mysql');

const db = {
  connection: null,
  state: false,

  /* Connects to a locally hosted MYSQL database */
  connect: (url, callback) => {
    this.connection = mysql.createConnection({
      host: url,
      user: "admin",
      password: "password",
      database: "mco2"
    })

    this.connection.connect(function(err, result){
      if(err) console.log(err);
      this.state = true;
      console.log("connected to mysql central node uwu!");
      db.autoCommit(0, (result) => console.log('central autocommit = 0;'))
      return callback(result);
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

  rollback: (callback) => {
    const query = `ROLLBACK;`
    this.connection.query(query, (err, result) => {
      if (err) throw err;
      console.log("Result: ", result);
      return callback(result);
    })
  },

  sleep: (callback) => {
    const query = `SELECT SLEEP(2);`
    this.connection.query(query, (err, result) => {
      if (err) throw err;
      console.log("Result: ", result);
      return callback(result);
    })
  },

  close: (callback) => {
    this.connection.end((err, result) => {
      if(err) throw err;
      console.log("connection: successfully closed central node");
      this.state = false;
      return callback(result);
    });
  }
}

module.exports = db;