const db = require("../models/db");
const db_left = require("../models/db_left");
const db_right = require("../models/db_right");

const ReplicateController = {

  /**
   * replicate
   * 
   * Replicates data to left or right node from central node
   * @param {*} name name of movie to insert
   * @param {*} year year of movie to insert
   */
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

  /**
   * delete
   * 
   * Deletes data found in right or left node that was deleted from the central node
   * @param {*} name name of movie to delete
   * @param {*} year year of movie to delete
   */
  delete: (name, year) => {
    const query = "DELETE FROM movies " +
                  `WHERE movies.name = '${name}' AND movies.year = '${year}'`
    
    if(year < 1980)
      db_left.query(query, () => {});
    else
      db_right.query(query, () => {});
  },

  /**
   * update
   * 
   * updates data found in right or left node that was updated from the central node
   * @param {*} name name of movie to update
   * @param {*} year year of movie to update
   */
  update: (id, name, year) => {
    const query = `UPDATE movies ` +
                  `SET movies.name = "${name}", movies.year = ${year} ` +
                  `WHERE id = ${id}`
    
    if(year < 1980)
      db_left.query(query, () => {});
    else
      db_right.query(query, () => {});
  },

  /**
   * getID
   * 
   * gets latest id from central node
   * @param {*} callback callback function
   */
  getID: (callback) => {
    const query = `SELECT MAX(id) as id FROM mco2.movies;`

    db.query(query, (row) => {
      return callback(row[0].id)
    })
  },

  /**
   * getID
   * 
   * gets latest id from left and right node
   * @param {*} callback callback function
   */
   getIDLeftAndRight: (callback) => {
    const query = `SELECT MAX(id) as id FROM mco2.movies;`

    db_left.query(query, (id_left) => {
      db_right.query(query, (id_right) => {
        if(id_left[0].id > id_right[0].id)
          return callback(id_left[0].id)
        else
          return callback(id_right[0].id)
      })
    })
    
  }
}

module.exports = ReplicateController;