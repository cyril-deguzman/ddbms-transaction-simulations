const db = require(`../models/db.js`)

const IndexController = {

  getIndex: (req, res) => {
    res.render('index');
  },

}

module.exports = IndexController