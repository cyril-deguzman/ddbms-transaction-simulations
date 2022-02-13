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

db.connect(url);
db_left.connect(url_left);
db_right.connect(url_right);

app.use(`/`, routes);

app.listen(port, () => console.log(`connected to: localhost://${port}`))

