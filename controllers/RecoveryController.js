const db = require(`../models/db.js`)
const db_left = require("../models/db_left");
const db_right = require("../models/db_right");

let status = arr => arr.every(Boolean);

const RecoveryController = {
  /**
   * debug
   * 
   * placeholder function.
   */
  debug: () => {
    console.log(`debug`);
  },

  /**
   * checkTable
   * 
   * checks the recovery table of each node when all of them are live and sorts them in corresponding arrays.
   * @param {*} callback callback function for the IndexController to handle.
   * @returns 
   */
  checkTable: (callback) => {
    const query = `SELECT * FROM recovery`
    let queriesAll = [];
    let queriesCentral = [];
    let queriesLeft = [];
    let queriesRight = [];

    let centralState = db.checkConnection()
    let leftState = db_left.checkConnection()
    let rightState = db_right.checkConnection()

    let state = status([centralState, leftState, rightState])

    if(state) 
      db.query(query, (result) => {
        queriesAll = [...queriesAll, ...result]

        db_left.query(query, (result) => {
          queriesAll = [...queriesAll, ...result]

          db_right.query(query, (result) => {
            queriesAll = [...queriesAll, ...result]

            queriesAll.forEach((row) => {
              switch(row.node) {
                case '1': queriesCentral.push(row.query); break;
                case '2': queriesLeft.push(row.query); break;
                case '3': queriesRight.push(row.query); break;
              }
            }) 

            return callback(state);
          })
        })
        
      })

    else 
      return callback(state);
    
  },

}

module.exports = RecoveryController