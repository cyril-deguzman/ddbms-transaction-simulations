/* import dependencies */
const dotenv = require(`dotenv`)
const express = require(`express`)
const hbs = require(`hbs`)
const bodyParser = require(`body-parser`)

/* import local dependencies */
const routes = require(`./routes/routes.js`)
const db = require(`./models/db.js`)
const db_left = require(`./models/db_left.js`)
const db_right = require(`./models/db_right.js`)
const RecoveryController = require("./controllers/RecoveryController.js")

/* local functions */
const sleep = ms => new Promise(r => setTimeout(r, ms));
const wait = async () => { await sleep(3000) }
const app = express()

app.use(bodyParser.urlencoded({ extended: false }));

app.set(`view engine`, `hbs`);
hbs.registerPartials(__dirname + `/views/partials`);

dotenv.config();
port = process.env.PORT;
url = process.env.DB_URL;
url_left = process.env.DB_LEFT;
url_right = process.env.DB_RIGHT;

app.use(express.static(`public`));

db_left.connect(url_left, ()=>{});
db_right.connect(url_right, ()=>{});
wait()
db.connect(url, ()=> {
  RecoveryController.checkTable(()=>{
    db.autoCommit(0, (result) => console.log('central autocommit = 0'))
    app.use(`/`, routes);
    app.listen(port, () => console.log(`connected to: localhost://${port}`))
  })
});



