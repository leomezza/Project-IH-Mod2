const express = require('express');
const hbs = require('hbs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const connectMongo = require('connect-mongo');

const MongoStore = connectMongo(session);

const appRoutes = require('./routes/appRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

mongoose.connect('mongodb://localhost/shorty-database', { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log('Connected with MongoDB'))
  .catch(error => {
    console.log(error);
    throw new Error('An error occurred while trying to connect with MongoDB');
  });

app.use(session({
  secret: '98asdioahsd98ya8h897hiu11dasd1564651321jdiojsd89u',
  saveUninitialized: false,
  resave: true,
  rolling: true,
  cookie: { maxAge: 120000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 60 * 60 * 24,
  }),
}));

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', authRoutes);
app.use('/', appRoutes);

app.listen(3000, () => console.log('App running on Port 3000'));
