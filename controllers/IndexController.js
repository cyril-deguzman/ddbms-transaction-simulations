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
   * postAddMovie
   * 
   * inserts a movie into the database
   * @param {*} req 
   * @param {*} res 
   */
  postAddMovie: (req, res) => {
    const {
      name,
      year
    } = req.body

    const query = "INSERT INTO movies (`name`, `year`) " +
                  `VALUES ("${name}", ${year}); `

    db.startTransaction((result) => {
      db.query(query, (row) => {
        db.commit((result) => {
          if(row)
            ReplicateController.replicate(name, year);
          else
            RecoveryController.debug("insert", name, year);
          res.send(result);
        })
      })
    })

  },

  /**
   * postDeleteMovie
   * 
   * deletes a movie from the database.
   * @param {*} req 
   * @param {*} res 
   */
  postDeleteMovie: (req, res) => {
    const {
      name,
      year
    } = req.body

    const query = "DELETE FROM movies " +
                  `WHERE movies.name = '${name} AND movies.year = '${year}'`

    db.startTransaction((result) => {
      db.query(query, (row) => {
        db.commit((result) => {
          if(row)
            ReplicateController.replicate(name, year);
          else
            RecoveryController.debug("delete", name, year);
          res.send(result);
        })
      })
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