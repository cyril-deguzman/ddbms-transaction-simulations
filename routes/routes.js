const express = require(`express`)
const IndexController = require(`../controllers/IndexController.js`)

const app = express()

app.get(`/`, IndexController.getIndex);

module.exports = app