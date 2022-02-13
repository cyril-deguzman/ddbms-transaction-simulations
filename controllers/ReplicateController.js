const db = require("../models/db");
const db_left = require("../models/db_left");
const db_right = require("../models/db_right");

const ReplicateController = {
  replicate: (name, year) => {
    ReplicateController.getID((id) => {
      const query = "INSERT INTO movies (id, `name`, `year`) " +
                    `VALUES (${id} ,"${name}", ${year}); `
      
      if(year < 1980)
        db_left.query(query, () => {});
      else 
        db_right.query(query, () => {});
    });
  },

  delete: (name, year) => {
    const query = "DELETE FROM movies " +
                  `WHERE movies.name = '${name} AND movies.year = '${year}'`
    
    if(year < 1980)
      db_left.query(query, () => {});
    else
      db_right.query(query, () => {});
  },

  getID: (callback) => {
    const query = `SELECT MAX(id) as id FROM mco2.movies;`

    db.query(query, (row) => {
      return callback(row[0].id)
    })
  }
}

module.exports = ReplicateController;