const express = require(`express`)
const IndexController = require(`../controllers/IndexController.js`)

const app = express()

app.get(`/`, IndexController.getIndex);
app.get(`/isolation/:isolvl`, IndexController.setIsolationLevel);
app.get(`/checkiso`, IndexController.getIsolationLevel);

app.post(`/add`, IndexController.postAddMovie);
app.post(`/delete`, IndexController.postDeleteMovie);

module.exports = app