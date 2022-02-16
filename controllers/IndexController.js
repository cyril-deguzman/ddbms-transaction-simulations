/* import dependencies */
const dotenv = require(`dotenv`)

/* import databases */
const db = require(`../models/db.js`)
const db_left = require("../models/db_left");
const db_right = require("../models/db_right");

/* import auxiliary controllers */
const ReplicateController = require(`./ReplicateController.js`)
const RecoveryController = require(`./RecoveryController.js`)

/* process env files */
dotenv.config('../.env');
const url = process.env.DB_URL;
const url_left = process.env.DB_LEFT;
const url_right = process.env.DB_RIGHT;

const IndexController = {

  /**
   * getIndex
   * 
   * renders Index page
   * @param {*} req 
   * @param {*} res 
   */
  getIndex: (req, res) => {
    res.render('index');
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
                  "WHERE `name` = '" + name + "';"

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
    
      if(!db.checkConnection()){
        ReplicateController.getIDLeftAndRight((id) => {
          id += 1;
          const queryRecovery = "INSERT INTO movies (id, `name`, `year`) " +
                                `VALUES (${id},"${name}", ${year}); `
          let dbc = db_right;
          if(year < 1980)
            dbc = db_left;
         
          dbc.query(queryRecovery, () => {
            const queryRecovery = "INSERT INTO recovery (`query`, node) " + 
                                  'VALUES ("INSERT INTO movies (id, `name`, `year`) VALUES (' + id + ', \'' + name + '\' , \'' + year + '\')", 1);'
            db_left.query(queryRecovery, () => {
              res.send("added movie and saved to recovery");
            })                
          })     
        });
      }

      else{
        db.startTransaction((result) =>{
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
      }  
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
        db.sleep((result) => {
          db.commit((result) => {
            if(row)
              ReplicateController.delete(name, year);
            else
              RecoveryController.debug("delete", name, year);
            res.send(result);
          })
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
        db.sleep((result) => {
          db.commit((result) => {
            if(row)
              ReplicateController.update(id, name, year);
            else
              RecoveryController.debug("update", name, year);
            res.send(result);
          })
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
    var isoLvl = req.body.isolvl;
    
    switch(isoLvl) {
      case '1': isoLvl="Read Uncommitted"; break;
      case '2': isoLvl="Read Committed"; break;
      case '3': isoLvl="Repeatable Read"; break;
      case '4': isoLvl="Serializable"; break;
    }

    const query = `SET SESSION TRANSACTION ISOLATION LEVEL ${isoLvl}`;
    console.log(query);

    db.query(query, (result) => {
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

  /**
   * postToggleCentral
   * 
   * toggles connection with the central node
   * @param {*} req 
   * @param {*} res 
   */
  postToggleCentral: (req, res) => {
    const toggle = req.body.toggle;
    
    if(toggle == '1')
      db.connect(url, ()=>{
        RecoveryController.checkTable(()=>{
          res.send("recovered and reconnected to central node");
        })
      })
    else 
      db.close(()=>{})
  },

  /**
   * postToggleLeft
   * 
   * toggles connection with the left node
   * @param {*} req 
   * @param {*} res 
   */
  postToggleLeft: (req, res) => {
    const toggle = req.body.toggle;

    if(toggle == '1')
      db_left.connect(url_left, () => {
        console.log('debug toggle');
        res.send("reconnected to left node");
      })
    else 
      db_left.close(()=>{})
  },

  /**
   * postToggleRight
   * 
   * toggles connection with the right node
   * @param {*} req 
   * @param {*} res 
   */
  postToggleRight: (req, res) => {
    const toggle = req.body.toggle;

    if(toggle == '1')
      db_right.connect(url_right, () => {
        res.send("reconnected to right node");
      })
    else 
      db_right.close(()=>{})
  }
}

module.exports = IndexController