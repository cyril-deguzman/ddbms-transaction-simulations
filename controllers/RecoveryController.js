const db = require(`../models/db.js`)
const db_left = require("../models/db_left");
const db_right = require("../models/db_right");

const status = arr => arr.every(Boolean);
const sleep = ms => new Promise(r => setTimeout(r, ms));

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
  checkTable: async (callback) => {
    await sleep(3000);
    const query = `SELECT * FROM recovery`

    let queriesAll = [];
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

            if(queriesAll.length == 0)
              return callback('all in sync');
            else 
              RecoveryController.recover(queriesAll, (msg) => {
                RecoveryController.truncate(()=>{return callback(msg)})
            })
          })
        })
      })

    else 
      return callback(state);
    
  },

  /**
   * recover
   * 
   * sorts all the queries passed via node and runs the queries on their corresponding nodes.
   * @param {*} queries 
   * @param {*} callback 
   */
  recover: async (queries, callback) => {
    let queriesCentral = [];
    let queriesLeft = [];
    let queriesRight = [];

    queries.forEach((row) => {
      switch(row.node) {
        case '1': queriesCentral.push(row.query); break;
        case '2': queriesLeft.push(row.query); break;
        case '3': queriesRight.push(row.query); break;
      }
    }) 
    
    for(i = 0; i < queriesCentral.length; i++)  {
      db.query(queriesCentral[i], ()=>{});
      console.log('recover 1: ' + i)
      await sleep(7000);
    }
      
    for(j = 0; j < queriesLeft.length; j++) {
      db_left.query(queriesLeft[j], ()=>{});
      console.log('recover 2: ' + j)
      await sleep(5000);
    }
      
    for(k = 0; k < queriesRight.length; k++) {
      db_right.query(queriesRight[k], ()=>{});
      console.log('recover 3: ' + k)
      await sleep(5000);
    }
      
    await sleep(5000);
    return callback('recovery success');
  },

  /**
   * truncate
   * 
   * truncates all the queries stored in the recovery table upon executing all queries inside.
   * @param {*} callback 
   */
  truncate: (callback) => {
    const query = 'TRUNCATE TABLE recovery'

    db.query(query, (result) => 
      db_left.query(query, (result) => 
        db_right.query(query, (result) => 
          {return callback()}
        )
      )
    )
  }
}

module.exports = RecoveryController