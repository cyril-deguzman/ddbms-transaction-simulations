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
   * getMovie
   * 
   * searches a movie by name and returns if it matches a row.
   * @param {*} req 
   * @param {*} res 
   */
  getMovie: (req, res) => {
    const {name} = req.query;

    const query = `SELECT * FROM movies ` +
                  'WHERE `name` = "' + name + '";'

    db.startTransaction((result) => {
      db.query(query, (err, row) => {
        db.commit((result) => {
          if(row)
            res.send(result[0]);
          else {
            RecoveryController.debug("read", name, 0);
            res.send(err);
          }
        })
      })
    })
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
                  `WHERE movies.name = '${name}' AND movies.year = '${year}'`

    db.startTransaction((result) => {
      db.query(query, (row) => {
        db.commit((result) => {
          if(row)
            ReplicateController.delete(name, year);
          else
            RecoveryController.debug("delete", name, year);
          res.send(result);
        })
      })
    })

  },

  /**
   * postUpdateMovie
   * 
   * updates a fucking movie. uwu.
   * @param {*} req 
   * @param {*} res 
   */
  postUpdateMovie: (req, res) => {
    const {
      id,
      name,
      year
    } = req.body

    const query = `UPDATE movies ` +
                  `SET movies.name = "${name}", movies.year = ${year} ` +
                  `WHERE id = ${id}`

    db.startTransaction((result) => {
      db.query(query, (row) => {
        db.commit((result) => {
          if(row)
            ReplicateController.update(id, name, year);
          else
            RecoveryController.debug("update", name, year);
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
    var isoLvl = req.params.isolvl;
    
    switch(isoLvl) {
      case '1': isoLvl="Read Uncommitted"; break;
      case '2': isoLvl="Read Commited"; break;
      case '3': isoLvl="Repeatable Read"; break;
      case '4': isoLvl="Serializable"; break;
    }

    const query = `SET SESSION TRANSACTION ISOLATION LEVEL ${isoLvl}`;

    db.query(query, (result) => {
      console.log(result);

      if(result) 
        res.render('index');
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