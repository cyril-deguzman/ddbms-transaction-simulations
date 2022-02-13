const express = require(`express`)
const IndexController = require(`../controllers/IndexController.js`)

const app = express()

app.get(`/`, IndexController.getIndex);
app.get(`/isolation/:isolvl`, IndexController.setIsolationLevel);
app.get(`/checkiso`, IndexController.getIsolationLevel);
module.exports = app