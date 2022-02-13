const db = require(`../models/db.js`)
const ReplicateController = require(`./ReplicateController.js`)
const RecoveryController = require(`./RecoveryController.js`)

const IndexController = {

  /**
   * getIndex
   * 
   * renders Index page
   * @param {*} req 
   * @param {*} res 
   */
  getIndex: (req, res) => {
    res.render('index')
  },

  /**
   * getQuery
   * 
   * universal query function
   * @param {*} req 
   * @param {*} res 
   */
  getQuery: (req, res) => {
    const query = ` ` +
                  ` ` +
                  ` ` +
                  ` ` +
                  ` `

    db.query()
  },

  /**
   * postInsertMovie
   * 
   * inserts a movie to the database
   * @param {*} req 
   * @param {*} res 
   */
  postInsertMovie: (req, res) => {
    const {
      name,
      year
    } = req.body

    const query = `SET autocommit = 0;`+
                  `START TRANSACTION;` +
                  `INSERT INTO movies ("name", "year")` +
                  `VALUES (${name}, ${year});` +
                  `COMMIT;`

    db.query(query, (result) => {
      if(result)
        ReplicateController.replicate(result);
      else
        RecoveryController.debug();
    })
  },

  /**
   * setIsolationLevel
   * 
   * changes the central node's isolation level
   * @param {*} req 
   * @param {*} res 
   */
  setIsolationLevel: (req, res) => {
    const isoLvl = req.params.isolvl;

    const query = `SET SESSION TRANSACTION ISOLATION LEVEL ${isoLvl}`;

    db.query(query, (result) => {
      if(result) 
        res.send('true')
      else
        RecoveryController.debug()
    })
  },

  /**
   * getIsolationLevel
   * 
   * checks the current isolation level
   * @param {*} req 
   * @param {*} res 
   */
  getIsolationLevel: (req, res) => {
    const query = `SELECT @@transaction_ISOLATION;`;

    db.query(query, (result) => {
      if(result) 
        res.send(result)
      else
        RecoveryController.debug()
    })
  },
}

module.exports = IndexController