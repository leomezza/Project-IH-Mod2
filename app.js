require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const connectMongo = require('connect-mongo');

const MongoStore = connectMongo(session);

const index = require('./routes/index.routes');
const prot = require('./routes/prot.routes');

const app = express();

require('./configs/db.config');

// Middleware Setup
app.use(logger('dev')); //check usefulness
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'hjdfgdfoi17208hjsodfn7y0876234hkjhikfhusdf',
  saveUninitialized: false,
  resave: true,
  rolling: true,
  cookie: { maxAge: 120000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 60 * 60 * 24,
  }),
}));

// Express View engine setup
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');

app.use('/', index);
app.use('/', prot);

server.listen(process.env.PORT, () => {
  console.log(`Listening on http://localhost:${process.env.PORT}`);
});
