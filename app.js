/* import dependencies */
const dotenv = require(`dotenv`)
const express = require(`express`)
const hbs = require(`hbs`)
const bodyParser = require(`body-parser`)

/* import local dependencies */
const routes = require(`./routes/routes.js`)
const db = require(`./models/db.js`)
const db = require(`./models/db.js`)
const db = require(`./models/db.js`)

const app = express()

app.use(bodyParser.urlencoded({ extended: false }));

app.set(`view engine`, `hbs`);
hbs.registerPartials(__dirname + `/views/partials`);

dotenv.config();
port = process.env.PORT;
url = process.env.DB_URL;

app.use(express.static(`public`));

db.connect(url);

app.use(`/`, routes);

app.listen(port, () => console.log(`connected to: localhost://${port}`))

