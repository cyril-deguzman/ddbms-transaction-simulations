const express = require(`express`)
const IndexController = require(`../controllers/IndexController.js`)

const app = express()

app.get(`/`, IndexController.getIndex);
app.get(`/checkiso`, IndexController.getIsolationLevel);
app.get(`/search`, IndexController.getMovie);

app.post(`/isolation`, IndexController.setIsolationLevel);
app.post(`/add`, IndexController.postAddMovie);
app.post(`/delete`, IndexController.postDeleteMovie);
app.post(`/update`, IndexController.postUpdateMovie);
module.exports = app